const apiError = (error, request, response, next) => {
    if (error.code === 400) {
        response.status(400).send(error);
    } else if (error.code === 404) {
        response.status(404).send(error)
    } else {
        next(error);
    }
}

const customErrors = (error, request, response, next) => {
    if (error.code === "22P02") {
        response.status({ code: 400, msg: "Invalid endpoint" })
    } else if (error.code === "42601") {
        response.status(400).send({ code: 400, msg: "Invalid query" })
    } else if (error.code === "42703") {
        response.status(400).send({ code: 400, msg: "Invalid query" })
    } else {
        console.log(error, "ERROR HERE!!!")
        next()
    }
}
module.exports = { apiError, customErrors };