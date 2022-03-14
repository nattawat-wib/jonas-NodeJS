const mongoose = require("mongoose");
const Tour = require("./tourModel");

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
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "review must have a user"]
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
    this
    // .populate({
    //     path: "tour",
    //     select: "name"
    // })
    .populate({
        path: "user",
        select: "name photo"
    })

    next()
})

reviewSchema.statics.calcAverageRatings = async function(tour_id) {
    const stats = await this.aggregate([
        {
            $match: { tour: tour_id }
        },
        {
            $group: {
                _id: "$tour",
                nRating: { $sum: 1 },
                avgRating: { $avg: "$rating" }
            }
        }
    ]);
    
    if(stats.length > 0) {
        await Tour.findByIdAndUpdate(tour_id, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        })
    } else {
        await Tour.findByIdAndUpdate(tour_id, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        })
    }
}

reviewSchema.post("save", function() {
    this.constructor.calcAverageRatings(this.tour)
})

reviewSchema.pre(/^fundOneAnd/, async function(next) {
    this.r = await this.findOne();
    next();
})

reviewSchema.post(/^fundOneAnd/, async function() {
    await this.r.constructor.calcAverageRatings(this.r.tour);
})

module.exports = mongoose.model("Review", reviewSchema);