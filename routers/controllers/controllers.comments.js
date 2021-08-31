const { selectComments, removeComment, updateComment } = require("../models/models.comments.js");

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

const patchComment = (request, response, next) => {
    const {comment_id} = request.params;
    const {inc_votes} = request.body;
    updateComment(comment_id, inc_votes)
        .then((comments) => {
            console.log(comments)
            response.status(200).send(comments[0])
        })
}

module.exports = { getComments, deleteComment, patchComment };