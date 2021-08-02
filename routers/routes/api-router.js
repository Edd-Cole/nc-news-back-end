const apiRouter = require("express").Router();
const { getTopics } = require("../controllers/controllers.js")

apiRouter.get("/topics", getTopics)

module.exports = apiRouter;