const { selectComments } = require("../models/models.comments.js");

const getComments = (request, response, next) => {
    const commentsInfo = request.query;
    selectComments(commentsInfo)
        .then(comments => {
            response.status(200).send({ comments })
        })
        .catch(error => {
            if (error.code === "42703") {
                next({ code: 400, msg: "invalid query" })
            } else {
                next(error)
            }
        })
}

module.exports = { getComments };