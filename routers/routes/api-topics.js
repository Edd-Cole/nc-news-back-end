const apiTopics = require("express").Router();
const { getTopics, postTopic } = require("../controllers/controllers.topics.js")

apiTopics.route("/")
    .get(getTopics)
    .post(postTopic)

module.exports = apiTopics;