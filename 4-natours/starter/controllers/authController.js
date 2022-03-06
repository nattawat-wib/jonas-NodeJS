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
    if(!email || !password) return next(new AppError("please provide email and password"));

    // 2) check is password correct
    const user = await User.findOne({ email }).select("+password");
    const is_password_correct = await user.correctPassword(password, user.password);

    if(!user || !is_password_correct) return next(new AppError("email or password is not correct", 401))

    // 3) sent token back to client 
    const token = signToken(user._id);

    res.status(200).json({
        status: "success",
        token
    })
})