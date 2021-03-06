const AppError = require("./../utils/appError");

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`
    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
    // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field: value [${err.keyValue.name}] please use another`
    return new AppError(message, 400)
}

const handleValidationDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`
    return new AppError(message, 400)
}

const handleJWTError = () => new AppError("Invalid token please login")
const handleJWTExpiredError = () => new AppError("Ypur token has expxpired please login again")

const send_error_dev = (err, req, res) => {
    // API
    if(req.originalUrl.startsWith("/api")) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err
        })

    // Render Webpage
    } else {
        res.status(err.statusCode).render("error", {
            title: "something went wrong!!",
            msg: err.message
        })
    }
}

const send_error_prod = (err, req, res) => {
    console.error("ERROR : ", err)

    // API
    if(req.originalUrl.startsWith("/api")) {
        // Operation error send msg to client
        if(err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            })
    
        // Programmer or other unknown error
        } else {

            res.status(500).json({
                status: "error",
                message: "something went wrong",
            })
        }

    // Render Webpage
    } else {
        // Operation error send msg to client
        if(err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            })
    
        // Programmer or other unknown error
        } else {
            res.status(err.statusCode).json({
                status: err.status,
                message: "please try again later",
            })
        }
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if(process.env.NODE_ENV === "development") {        
        send_error_dev(err, req, res)
    } else if (process.env.NODE_ENV === "production") {
        let error = { ...err };
        error.name = err.name;
        error.message = err.message;

        // For cast error (invalid & not found ID)
        if(error.name === "CastError") error = handleCastErrorDB(error);
        // For duplicate value error
        else if(error.code === 11000) error = handleDuplicateFieldsDB(error);
        // For validate value error
        else if(error.name === "ValidationError") error = handleValidationDB(error);
        // For JWT
        else if(error.name === "JsonWebTokenError") error = handleJWTError();
        // For JWT Expired
        else if(error.name === "TokenExpiredError") error = handleJWTExpiredError();

        send_error_prod(error, req, res)
    }
}