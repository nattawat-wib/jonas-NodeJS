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
    photo: String,
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
            validator: function(el) {
                return el === this.password;
            },
            message: "Confirm password is not the same"
        }
    },
})

userSchema.pre("save", async function(next) {
    // run only password was modify
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 12);
    
    // delete confirm password don't save it to DB
    this.passwordConfirm = undefined;
    next()
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

module.exports = mongoose.model("User", userSchema)