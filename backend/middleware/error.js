const handleError = (statusCode ,msg) => {
    const error = new Error();
    error.status = statusCode;
    error.message = msg;
    console.log(error);
    return error;
}

module.exports = handleError;