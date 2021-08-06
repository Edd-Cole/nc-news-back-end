const apiError = (error, request, response, next) => {
    if (error.code === 400) {
        response.status(400).send(error);
    } else if (error.code === 404) {
        response.status(404).send(error)
    } else {
        response.sendstatus(500);
    }
}

module.exports = apiError;