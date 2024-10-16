const createError = (StatusCode,message) => {
    const error = new Error(message);
    error.statusCode = StatusCode;
    throw error
}

module.exports = createError