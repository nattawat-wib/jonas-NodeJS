const Tour = require("./../model/tourModel");
const User = require("./../model/userModel");
const Booking = require("./../model/bookingModel");
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

exports.get_tour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne( {slug: req.params.slug }).populate({
        path: "reviews",
        select: "review rating user"
    })

    if(!tour) return next(new AppError("This is no tour with that ID", 400))

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

exports.get_account = catchAsync(async (req, res) => {
    res.status(200).render("account", {
        title: "Your Account",
    })
})

exports.get_my_tour = catchAsync(async (req, res) => {
    // 1) find all booking
    const booking = await Booking.find({ user: req.user.id });

    // 2) find tours with returned ID
    const tour_id = booking.map(el => el.tour);
    const tours = await Tour.find({ _id: { $in: tour_id }})

    res.status(200).render("overview", {
        title: "My tours",
        tours
    })
})

exports.update_account_data = catchAsync(async (req, res) => {
    const updated_user = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    }, {
        new: true,
        runValidators: true
    })

    res.status(200).render("account", {
        title: "Your Account",
        user: updated_user
    })
})