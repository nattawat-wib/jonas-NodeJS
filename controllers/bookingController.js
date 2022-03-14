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
        // success_url: `${req.protocol}://${req.get("host")}/?tour=${req.params.tour_id}&user=${req.user.id}&price=${tour.price}`,
        success_url: `${req.protocol}://${req.get("host")}/account-my-tour`,
        cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tour_id,
        line_items: [
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                images: [
                    `${req.protocol}://${req.get("host")}/img/tours/${tour.imageCover}`,
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

// exports.create_booking_checkout = catchAsync(async (req, res, next) => {
//     const { tour, user, price } = req.query;

//     if(!tour && !user && !price) return next();
        
//     await Booking.create({ tour, user, price });

//     res.redirect(req.originalUrl.split("?")[0]);
// })

const create_booking_checkout = async session => {
    const tour = session.client_reference_id;
    const user = await User.findOne({ email: session.customer_email }).id;
    const price = session.line_items[0].amount / 100;

    console.log("session", session)
    console.log("tour", tour)
    console.log("user", user)
    console.log("price", price)

    await Booking.create({ tour, user, price });
}

exports.webhook_checkout = (req, res, text) => {
    const signature = req.headers["stripe-signature"];
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody.toString(), 
            signature, 
            process.env.SPRITE_WEBHOOK_SECRET
        );
            
    console.log("event", event)

    } catch (e) {
        console.log("e", e)
        console.log("error", e.message)

        return res.status(400).send(`Webhook error: ${e.message}`)
    }

    if(event.type === "checkout.session.completed") {
        create_booking_checkout(event.data.object)
    }

    res.status(200).json({ received: true })
}

exports.create_booking = factory.create_one(Booking);
exports.get_booking = factory.get_one(Booking);
exports.get_all_booking = factory.get_all(Booking);
exports.update_booking = factory.update_one(Booking);
exports.delete_booking = factory.delete_one(Booking);