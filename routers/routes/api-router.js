const apiRouter = require("express").Router();
const apiTopics = require("./api-topics.js")
const apiArticles = require("./api-articles.js");
const apiUsers = require("./api-users.js");
const apiComments = require("./api-comments.js");
const getEndpoints = require("../controllers/controllers.api.js")
const app = require("../../app.js");

apiRouter.get("/", getEndpoints)
apiRouter.use("/topics", apiTopics)
apiRouter.use("/articles", apiArticles)
apiRouter.use("/users", apiUsers);
apiRouter.use("/comments", apiComments)

module.exports = apiRouter;