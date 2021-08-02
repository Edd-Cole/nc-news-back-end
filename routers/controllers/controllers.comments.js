const { selectComments } = require("../models/models.comments.js");

const getComments = (request, response, next) => {
    selectComments()
        .then(comments => {
            response.status(200).send({ comments })
        })
}

module.exports = { getComments };