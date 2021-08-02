const apiRouter = require("express").Router();
const apiTopics = require("./api-topics.js")

apiRouter.use("/topics", apiTopics)

module.exports = apiRouter;