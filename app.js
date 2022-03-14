const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");
const bookingRouter = require("./routes/bookingRoutes");

const app = express();

app.enable("trust proxy")

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")));

// 1) MIDDLEWARES
app.use(cors());
app.options("*", cors());

// set secure HTTP header
// app.use(helmet())

// Development logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

// Limit request from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP, please try again in an hour!"
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Data sanitization  from NoSQL query injection (remove $ ,)
app.use(mongoSanitize());

// Data sanitization  from XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist: ["duration", "ratingsQuantity", "ratingsQuantity", "maxGroupSize", "difficulty", "price"]
}));

app.use(compression())

app.use("/", viewRouter)
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/reviews", reviewRouter)
app.use("/api/v1/bookings", bookingRouter)

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 400))
})

app.use(globalErrorHandler)

module.exports = app;