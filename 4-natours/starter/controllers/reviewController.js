const Review = require("./../model/reviewModel");
const AppError = require("./../utils/appError");
const apiFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");

exports.get_all_review = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();

    res.status(200).json({
        status: "success",
        results: reviews.length,
        data: {
            reviews
        }
    })
})

exports.create_review = catchAsync(async (req, res, next) => {
    // Allow nested routes
    if(!req.body.tour) req.body.tour = req.params.tour_id;
    if(!req.body.author) req.body.author = req.user.id;

    const new_review = await Review.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            new_review
        }
    })
})