const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true,
        trim: true,
        maxlength: [40, "A tour name must have less than 40 char"],
        minlength: [10, "A tour name must have more than 10 char"],
        // validate: [validator.isAlpha, "A tour name must be contain only char"]
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, "A tour must have a durations"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a group size"]
    },
    difficulty: {
        type: String,
        required: [true, "A tour must have a difficulty"],
        enum: {
            values: ["easy", "medium", "difficult"],
            message: "difficult can set only EAST MEDIUM DIFFICULT"
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be above 1.0"],
        max: [5, "Rating must be below 5.0"]
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"]
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val) {
                return val < this.price;
            },
            message: "Discount price {VALUE} should be below regular price"
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, "A tour must have a summary"]
    },
    description: {
        type: String,
        trim: true
    },
    imageCover : {
        type: String,
        required: [true, "A tour must have a cover image"]
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

tourSchema.virtual("durationWeeks").get(function() {
    return this.duration / 7
})

// // Middleware run before .save() .create()
// tourSchema.pre("save", function(next) {
//     this.slug = slugify(this.name, {lower: true})
//     next();
// })

// tourSchema.pre("save", function(next) {
//     console.log("Will save document...");
//     next();
// })

// tourSchema.post("save", function(doc, next) {
//     console.log(doc);
//     next();
// })

// // Query middleware
// tourSchema.pre(/^find/, function(next) {
//     this.find({ secretTour: { $ne: true } })
//     this.start = Date.now();
//     next();
// })

// tourSchema.post(/^find/, function(doc, next) {
//     console.log(`take time : ${Date.now() - this.start} millisecond`)
//     next();
// })

// // Aggregate middleware
// tourSchema.pre("aggregate", function(next) {
//     this.pipeline().unshift( { $match: {secretTour: {$ne: true} } } )

//     console.log(this.pipeline())
//     next()
// })

module.exports = mongoose.model("Tour", tourSchema)