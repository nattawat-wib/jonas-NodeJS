const express = require("express");
const fs = require("fs");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// 1) MIDDLEWARES
// set secure HTTP header
app.use(helmet())

// Development logging
if(process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

// Limit request from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP, please try again in an hour!"
});
app.use("/api", limiter)

// Bpdy parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// serving static file
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next()
})

// 3) ROUTE
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 400))
})

app.use(globalErrorHandler)

module.exports = app;