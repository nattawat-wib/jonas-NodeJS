const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../model/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const new_user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        // passwordChangeAt: req.body.passwordChangeAt,
        role: req.body.role
    })

    const token = signToken(new_user._id);

    res.status(201).json({
        status: "success",
        token,
        data: {
            user: new_user
        }
    })
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
    const token = signToken(user._id);

    res.status(200).json({
        status: "success",
        token
    })
})

exports.protect = catchAsync(async (req, res, next) => {
    let token;

    // 1) get token & check token was provide
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return next(new AppError("You're not login yet", 400))

    // 2) verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    // 3) check if 
    const current_user = await User.findById(decoded.id);
    if (!current_user) return next(new AppError("this token is not belong with this user", 401));

    // 4) check if user change password after issue
    if (current_user.changePasswordAfter(decoded.iat)) return next(new AppError("User recently change password!", 400));

    req.user = current_user
    next()
})

exports.restrict_to = (...roles) => {
    return (req, res, next) => {
        console.log(req.user.role)
        console.log(roles)
        if (!roles.includes(req.user.role)) return next(new AppError("You have no permission to perform", 400))

        next()
    }
}

exports.forget_password = catchAsync(async (req, res, next) => {
    console.log("rrrrr")

    // 1) check is user exist by email
    const user = await User.findOne({ email: req.body.email });
    if(!user) return next(new AppError("There is no user with this emsil", 404))

    // 2) Generate random reset token
    const reset_token = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false })

    // 3) send email to user
})

exports.reset_password = catchAsync(async (req, res, next) => {

})
