const User = require("./../model/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el]
    })

    return newObj
}

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

exports.edit_profile = catchAsync(async (req, res, next) => {
    // 1) Error if user try to edit password in this route 
    if(req.body.password || req.body.passwordConfirm) return next(new AppError("cannot update password here pls go to /update-password"))

    //2) filter body object
    const filteredBody = filterObj(req.body, "name", "email")
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: "success",
        data: {
            updatedUser
        }
    })
})

exports.delete_account = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: "success",
        data: null
    })
})

exports.get_user = catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);

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