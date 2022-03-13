const User = require("./../model/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el]
    })

    return newObj
}

exports.get_my_account = (req, res, next) => {
    req.params.id = req.user.id;
    next();
} 

exports.update_my_account = catchAsync(async (req, res, next) => {
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

exports.delete_my_account = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(200).json({
        status: "success",
        data: "your account is delete successfully"
    })
})

exports.get_all_users = factory.get_all(User)
exports.get_user = factory.get_one(User)
exports.update_user = factory.update_one(User)
exports.delete_user = factory.delete_one(User)