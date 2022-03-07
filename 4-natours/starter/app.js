const express = require("express");
const fs = require("fs");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController")
const tourRouter = require("./routes/tourRoutes")
const userRouter = require("./routes/userRoutes")

const app = express();

// 1) MIDDLEQARE
if(process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log("header", req.headers)
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