const User = require("./../model/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");
const multer = require("multer");
const sharp = require("sharp");

// Multer config
// const multer_storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public/img/users")
//     },
//     filename:  (req, file, cb) => {
//         const ext = file.mimetype.split("/")[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
//     },
// });

const multer_storage = multer.memoryStorage();

const multer_filter = (req, file, cb) => {
    if(file.mimetype.startsWith("image")) {
        cb(null, true)
    } else {
        cb(new AppError("No an image! please upload image"), true)
    }
}

const upload = multer({ 
    storage: multer_storage,
    fileFilter: multer_filter
});

exports.upload_user_photo = upload.single("photo");

exports.resize_user_photo = catchAsync(async (req, res, next) => {    
    if(!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);

    next();
})
//

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
    if(req.file) filteredBody.photo = req.file.filename;

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