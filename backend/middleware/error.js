const handleError = (statusCode ,msg) => {
    const error = new Error();
    error.status = statusCode;
    error.message = msg;
    return error;
}

module.exports = handleError;