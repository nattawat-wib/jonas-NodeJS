const Review = require("./../model/reviewModel");
const AppError = require("./../utils/appError");
const apiFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");

exports.set_tour_user_id = (req, res, next) => {
    // Allow nested routes
    if(!req.body.tour) req.body.tour = req.params.tour_id;
    if(!req.body.user) req.body.user = req.user.id;
    next();
}

exports.get_all_review = factory.get_all(Review);
exports.get_review = factory.get_one(Review);
exports.create_review = factory.create_one(Review);
exports.update_review = factory.update_one(Review);
exports.delete_review = factory.delete_one(Review);
