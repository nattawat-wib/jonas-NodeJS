const User = require("../model/userModel");
const Tour = require("../model/tourModel");
const Booking = require("../model/bookingModel");

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

exports.get_checkout_session = catchAsync(async (req, res, next) => {
    // 1) get booked tour
    const tour = await Tour.findById(req.params.tour_id)

    // 2) create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        success_url: `${req.protocol}://${req.get("host")}/?tour=${req.params.tour_id}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tour_id,
        line_items: [
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                images: [
                    `https://www.natours.dev/img/tours/${tour.imageCover}`,
                ],
                amount: tour.price * 100,
                currency: "usd",
                quantity: 1
            }
        ]
    })
    
    // 3) create session as response
    res.status(200).json({
        status: "success",
        session
    })
})

exports.create_booking_checkout = catchAsync(async (req, res, next) => {
    const { tour, user, price } = req.query;

    if(!tour && !user && !price) return next();
        
    await Booking.create({ tour, user, price });

    res.redirect(req.originalUrl.split("?")[0]);
})


exports.create_booking = factory.create_one(Booking);
exports.get_booking = factory.get_one(Booking);
exports.get_all_booking = factory.get_all(Booking);
exports.update_booking = factory.update_one(Booking);
exports.delete_booking = factory.delete_one(Booking);