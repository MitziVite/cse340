const errorHandler = (error, req, res, next) => {
    console.log(error);

    if (error.name === "AppError") {
        return res.status(error.statusCode).json({
            errorCode: error.errorCode,
        });
    } else {
        return res.status(500).send("Something went wrong");
    }
};

module.exports = errorHandler;
