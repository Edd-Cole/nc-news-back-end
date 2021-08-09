const apiError = (error, request, response, next) => {
    if (error.code === 400) {
        response.status(400).send(error);
    } else if (error.code === 404) {
        response.status(404).send(error)
    } else {
        next(error);
    }
}

const psqlError = (error, request, response, next) => {
    const invalidDataErrorCodes = ["23502", "23503", "23505"];
    const invalidQueryErrorCodes = ["42601", "42703"];
    if (error.code === "22P02") {
        response.status(400).send({ code: 400, msg: "Invalid endpoint" })
    } else
    if (invalidDataErrorCodes.includes(error.code)) {
        response.status(400).send({ code: 400, msg: "Invalid data received" })
    } else if (invalidQueryErrorCodes.includes(error.code)) {
        response.status(400).send({ code: 400, msg: "Invalid query" })
    } else {
        next(error)
    }
}

const fatalError = (error, request, response, next) => {
    response.status(500).send({ code: 500, msg: "Internal server error" })
}
module.exports = { apiError, psqlError, fatalError };