const apiTopics = require("express").Router();
const { getTopics, postTopic, patchTopicByID, deleteTopicByID, getTopicByID } = require("../controllers/controllers.topics.js")

apiTopics.route("/")
    .get(getTopics)
    .post(postTopic)

apiTopics.route("/:slug")
    .get(getTopicByID)
    .patch(patchTopicByID)
    .delete(deleteTopicByID)

module.exports = apiTopics;