const apiRouter = require("express").Router();
const apiTopics = require("./api-topics.js")
const apiArticles = require("./api-articles.js");
const apiUsers = require("./api-users.js");

apiRouter.use("/topics", apiTopics)
apiRouter.use("/articles", apiArticles)
apiRouter.use("/users", apiUsers);

module.exports = apiRouter;