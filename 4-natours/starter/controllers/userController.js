const User = require("./../model/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.get_all_users = catchAsync(async (req, res) => {
    const users = await User.find();

    res.status(500).json({
        status: "success",
        results: users.length,
        data: {
            users
        }
    })
})

exports.get_user = catchAsync(async (req, res) => {
    const user = await User.find();

    res.status(500).json({
        status: "success",
        data: {
            user
        }
    })
})

exports.create_user = catchAsync(async (req, res) => {
    const users = await User.find();

    res.status(500).json({
        status: "success",
        data: {
            users
        }
    })
})

exports.update_user = catchAsync(async (req, res) => {
    const users = await User.find();

    res.status(500).json({
        status: "success",
        data: {
            users
        }
    })
})

exports.delete_user = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if(!user) return next(new AppError("user is not found with this ID", 404));

    res.status(500).json({
        status: "success",
        message: "delete successfully"
    })
})