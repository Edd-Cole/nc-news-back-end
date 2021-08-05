const apiTopics = require("express").Router();
const { getTopics, postTopic, patchTopicByID } = require("../controllers/controllers.topics.js")

apiTopics.route("/")
    .get(getTopics)
    .post(postTopic)

apiTopics.route("/:slug")
    .patch(patchTopicByID)

module.exports = apiTopics;