const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, "booking must have a tour"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "booking must have a user"]
    },
    price: {
        type: Number,
        required: [true, "booking must have a price"]
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    paid: {
        type: Boolean,
        default: true
    }
})

bookingSchema.pre(/^find/, function(next) {
    this
    .populate({
        path: "tour",
        select: "name"
    })
    .populate("user")

    next()
})

module.exports = mongoose.model("Booking", bookingSchema);