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

const send_error_dev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    })
}

const send_error_prod = (err, res) => {
    // Operation error send msg to client
    if(err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })

    // Programmer or other unknown error
    } else {
        // console.error("ERROR : ", err)
        res.status(500).json({
            status: "error",
            message: "something went wrong",
        })
    }

}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if(process.env.NODE_ENV === "development") {        
        send_error_dev(err, res)
    } else if (process.env.NODE_ENV === "production") {
        let error = { ...err };
        error.name = err.name

        // For cast error (invalid & not found ID)
        if(error.name === "CastError") error = handleCastErrorDB(error);
        // For duplicate value error
        else if(error.code === 11000) error = handleDuplicateFieldsDB(error);
        // For validate value error
        else if(error.name === "ValidationError") error = handleValidationDB(error);

        send_error_prod(error, res)
    }
}