const apiComments = require("express").Router();
const { getComments, deleteComment, patchComment } = require("../controllers/controllers.comments.js");

apiComments.route("/").get(getComments);
apiComments.route("/:comment_id").patch(patchComment).delete(deleteComment)

module.exports = apiComments;