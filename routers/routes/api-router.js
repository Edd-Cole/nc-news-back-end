const apiRouter = require("express").Router();
const apiTopics = require("./api-topics.js")
const apiArticles = require("./api-articles.js");

apiRouter.use("/topics", apiTopics)
apiRouter.use("/articles", apiArticles)

module.exports = apiRouter;