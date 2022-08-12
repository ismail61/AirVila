import { error } from "..";

const handleCastErrorDB = (err, res) => {
    const message = `Invalid ${err.path}:${err.value}`;
    return error().resourceError(res, message, 400);
}

const handleDuplicateFieldsDB = (err, res) => {
    const value = err.message.match(/\{(.*?)\}/)[0];
    const message = `Duplicate field value:${value}. Please use another value`;
    return error().resourceError(res, message, 400);
}

const handleValidationErrorDB = (err, res) => {
    let message;

    Object.keys(err.errors).forEach((key) => {
        message = err.errors[key].message;
    });
    return error().resourceError(res, message, 400);
}

const sendErrorDev = (err, res) => {
    return error().resourceError(res, err.message, err.statusCode);
    /*     res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        }) */
}

const sendErrorProd = (err, res) => {

    // Programming error, unknown error: don't send error message
    //    logging error for developer
    console.log('Error', err);

    //  send to the client generic message
    return error().serverError(res);
}


export default (err, res) => {
    if (err.name === 'CastError') handleCastErrorDB(err, res);
    else if (err.code === 11000) handleDuplicateFieldsDB(err, res);
    else if (err.name === 'ValidationError') handleValidationErrorDB(err, res);
    else if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }
    else { //(process.env.NODE_ENV === 'production')
        sendErrorProd(err, res);
    }
}