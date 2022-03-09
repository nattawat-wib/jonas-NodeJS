const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "review is now allow to empty"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "review must have a rating"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, "review must have a tour"]
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "review must have a author"]
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

reviewSchema.pre(/^find/, function(next) {
    this
    // .populate({
    //     path: "tour",
    //     select: "name"
    // })
    .populate({
        path: "author",
        select: "name photo"
    })

    next()
})

module.exports = mongoose.model("Review", reviewSchema);