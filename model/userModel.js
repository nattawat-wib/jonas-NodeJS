const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "user most have a name"]
    },
    email: {
        type: String,
        required: [true, "user must have a email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "email is not valid"]
    },
    photo: {
        type: String,
        default: "default.jpg"
    },
    role: {
        type: String,
        enum: ["user", "guide", "lead-guide", "admin"],
        default: "user"
    },
    password: {
        type: String,
        required: [true, "user must have a password"],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "please confirm password"],
        validate: {
            // this work only CREATE and SAVE 
            validator: function (el) {
                return el === this.password;
            },
            message: "Confirm password is not the same"
        }
    },
    passwordChangeAt: Date,
    PasswordResetToken: String,
    PasswordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
})

userSchema.pre("save", async function (next) {
    // run only password was modify
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 12);

    // delete confirm password don't save it to DB
    this.passwordConfirm = undefined;
    next()
})

userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) return next();

    this.passwordChangeAt = Date.now() - 1000;
    next()
})

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne : false } })
    next()
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangeAt) {
        const changeTimestamp = parseInt(this.passwordChangeAt.getTime()) / 1000;
        return JWTTimestamp < changeTimestamp
    }

    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.PasswordResetToken = crypto.createHash("sha256").update(resetToken).digest();
    this.PasswordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken
}

module.exports = mongoose.model("User", userSchema)