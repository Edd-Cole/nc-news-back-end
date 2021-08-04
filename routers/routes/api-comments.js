const apiComments = require("express").Router();
const { getComments, deleteComment } = require("../controllers/controllers.comments.js");

apiComments.route("/").get(getComments);
apiComments.route("/:comment_id").delete(deleteComment)

module.exports = apiComments;