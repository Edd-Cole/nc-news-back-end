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
        response.status(400).send({ code: 400, msg: "Invalid endpoint" })
    } else
    if (error.code === "23502") {
        response.status(400).send({ code: 400, msg: "Invalid data received" })
    } else if (error.code === "23503") {
        response.status(400).send({ code: 400, msg: "Invalid data received" });
    } else if (error.code === "23505") {
        response.status(400).send({ code: 400, msg: "Invalid data received" })
    } else if (error.code === "42601") {
        response.status(400).send({ code: 400, msg: "Invalid query" })
    } else if (error.code === "42703") {
        response.status(400).send({ code: 400, msg: "Invalid query" })
    } else {
        next(error)
    }
}
module.exports = { apiError, customErrors };

// if (error.code === "23502") {
//     next({ code: 400, msg: "author and body must be specified" })
// } else if (error.code === "23503") {
//     next({ code: 400, msg: "author must reference a username, article_id must exist and body must be of type String" })
// } else if (error.code === "22P02") {
//     next({ code: 400, msg: "article_id must be a number" })
// } else {
//     console.log(error)
//     next(error)
// }