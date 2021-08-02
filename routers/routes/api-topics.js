const apiTopics = require("express").Router();
const { getTopics } = require("../controllers/controllers.topics.js")

apiTopics.get("/", getTopics)

module.exports = apiTopics;