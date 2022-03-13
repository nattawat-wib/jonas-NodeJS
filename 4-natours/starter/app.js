const path = require("path");
const express = require("express");
const fs = require("fs");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"))

// serving static file
app.use(express.static(path.join(__dirname, "public")));

// 1) MIDDLEWARES
// set secure HTTP header
// app.use(helmet())
app.use(helmet({
    crossOriginResourcePolicy: false,
}))

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

// Bpdy parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Data sanizitation  from NoSQL query injection (remove $ ,)
app.use(mongoSanitize());

// Data sanizitation  from XSS
app.use(xss());

// Prevent parameter pullution
app.use(hpp({
    whitelist: ["duration", "ratingsQuantity", "ratingsQuantity", "maxGroupSize", "difficulty", "price"]
}));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next()
})

// 3) ROUTE
app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "script-src  'self' connect.facebook.net maps.googleapis.com cdnjs.cloudflare.com cdn.quilljs.com *.aws",
      "script-src-elem 'self' connect.facebook.net maps.googleapis.com cdnjs.cloudflare.com cdn.quilljs.com *.aws",
      "style-src 'self' cdnjs.cloudflare.com; localhost:8000;",
      "img-src 'self'"
    );
    next();
  });

app.use((req, res, next) => {
    // console.log(req.cookies)
    // res.setHeader(
    //     'Content-Security-Policy',
    //     "script-src  'self' api.mapbox.com",
    //     "script-src-elem 'self' api.mapbox.com",
    // );
    
    next();
});

app.use("/", viewRouter)
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/reviews", reviewRouter)

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 400))
})

app.use(globalErrorHandler)

module.exports = app;