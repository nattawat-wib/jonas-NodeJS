const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const User = require("./../model/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Email = require("./../utils/email");

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSentToken = (user, statusCode, req, res) => {
    const token = signToken(user.id);

    res.cookie("jwt", token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: (req.secure || req.headers["x-forwarded-proto"] === "https")
    });
    user.password = undefined;

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user
        }
    })    
}

exports.signup = catchAsync(async (req, res, next) => {
    const new_user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    })

    const url = `${req.protocol}://${req.get("host")}/account`;

    await new Email(new_user, url).sendWelcome();

    createSentToken(new_user, 201, req, res);
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) check is email and password exits
    if (!email || !password) return next(new AppError("please provide email and password", 400));

    // 2) check is password correct
    const user = await User.findOne({ email }).select("+password");
    const is_password_correct = await user.correctPassword(password, user.password);

    if (!user || !is_password_correct) return next(new AppError("email or password is not correct", 401))

    // 3) sent token back to client 
    createSentToken(user, 201, req, res);
})

exports.logout = catchAsync(async (req, res, next) => {
    res.cookie("jwt", "logout", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).json({ status: "success" })
})

exports.protect = catchAsync(async (req, res, next) => {
    let token;

    // 1) get token & check token was provide
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) return next(new AppError("You're not login yet", 400))

    // 2) verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    // 3) check if user still exist
    const current_user = await User.findById(decoded.id);
    if (!current_user) return next(new AppError("this token is not belong with this user", 401));

    // 4) check if user change password after issue
    if (current_user.changePasswordAfter(decoded.iat)) return next(new AppError("User recently change password!", 400));

    req.user = current_user;
    res.locals.user = current_user;
    next()
})

// Only for render pages
exports.isLoggedIn = catchAsync(async (req, res, next) => {
    if (!req.cookies.jwt) return next();

    try{
        // 1) verify token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)

        // 2) check if user still exist 
        const current_user = await User.findById(decoded.id);
        if (!current_user) return next();

        // 4) check if user change password after issue
        if (current_user.changePasswordAfter(decoded.iat)) return next();

        res.locals.user = current_user;
        return next();
    } catch (e) {
        return next();
    }
})

exports.restrict_to = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) return next(new AppError("You have no permission to perform", 400))
        next()
    }
}

exports.forget_password = catchAsync(async (req, res, next) => {

    // 1) check is user exist by email
    const user = await User.findOne({ email: req.body.email });

    if(!user) return next(new AppError("There is no user with this email", 404))

    // 2) Generate random reset token
    const reset_token = user.createPasswordResetToken();
    user.PasswordResetToken = reset_token;
    await user.save({ validateBeforeSave: false })

    // 3) send email to user
    try {
        const reset_URL = `${req.protocol}://${req.get("host")}/api/v1/users/reset-password/${reset_token}`
        await new Email(user, reset_URL).sendPasswordReset()

        res.status(200).json({
            status: "success",
            message: "Token sent to email"
        })
        
    } catch {
        user.PasswordResetToken = undefined;
        user.PasswordResetExpires = undefined;
        await user.save({ validateBeforeSave: false })

        return next(new AppError("sending email error occurred", 500))
    }
})

exports.reset_password = catchAsync(async (req, res, next) => {
    // 1) get user base on token
    // const hashed_token = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({ PasswordResetToken: req.params.token, PasswordResetExpires: { $gt: Date.now() } })
    
    // 2) if tohas has not exp, and there is user, set new password
    if(!user) return next(new AppError("token is invalid or expired", 400))
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.PasswordResetToken = undefined;
    user.PasswordResetExpires = undefined;
    await user.save();

    //3) Update changePasswordAt to User

    // 4) login user (sent JWT)
    createSentToken(user, 201, req, res);
})

exports.update_password = catchAsync(async (req, res, next) => {
    // 1) get user
    const user = await User.findById(req.user.id).select("+password")
    if(!user) return next(new AppError("no exist user", 401));

    // 2) check is old password collect
    const is_password_correct = await user.correctPassword(req.body.oldPassword, user.password)
    if(!is_password_correct) return next(new AppError("old password is not correct", 401));

    // 3) update password
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()

    // 4) login user (sent JWT)
    createSentToken(user, 201, req, res);
})