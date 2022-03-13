const Tour = require("./../model/tourModel");
const AppError = require("./../utils/appError");
const apiFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");

exports.get_overview = catchAsync(async (req, res) => {
    // 1) Get tour data from collection
    const tours = await Tour.find();

    // 3) render
    res.status(200).render("overview", {
        title: "All Tours",
        tours
    })
})

exports.get_tour = catchAsync(async (req, res) => {
    const tour = await Tour.findOne( {slug: req.params.slug }).populate({
        path: "reviews",
        select: "review rating user"
    })

    res.status(200).render("tour", {
        title: `${tour.name} Tour`,
        tour
    })
})

exports.get_login_form = catchAsync(async (req, res) => {
    res.status(200).render("login", {
        title: "login into your account",
    })
})