const apiTopics = require("express").Router();
const { getTopics, postTopic, patchTopicByID, deleteTopicByID } = require("../controllers/controllers.topics.js")

apiTopics.route("/")
    .get(getTopics)
    .post(postTopic)

apiTopics.route("/:slug")
    .patch(patchTopicByID)
    .delete(deleteTopicByID)

module.exports = apiTopics;