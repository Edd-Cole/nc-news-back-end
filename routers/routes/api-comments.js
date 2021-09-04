const apiComments = require("express").Router();
const { getComments, deleteComment, patchComment, getCommentByCommentId } = require("../controllers/controllers.comments.js");

apiComments.route("/").get(getComments);
apiComments.route("/:comment_id").get(getCommentByCommentId).patch(patchComment).delete(deleteComment)

module.exports = apiComments;