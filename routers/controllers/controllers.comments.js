const { selectComments, removeComment } = require("../models/models.comments.js");

const getComments = (request, response, next) => {
    const commentsInfo = request.query;
    selectComments(commentsInfo)
        .then(comments => {
            response.status(200).send({ comments })
        })
        .catch(error => {
            next(error)
        })
}

const deleteComment = (request, response, next) => {
    const { comment_id } = request.params;
    removeComment(comment_id)
        .then(() => {
            response.sendStatus(204)
        })
        .catch(error => {
            next(error)
        })
}

module.exports = { getComments, deleteComment };