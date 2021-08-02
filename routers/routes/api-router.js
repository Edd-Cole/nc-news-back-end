const apiRouter = require("express").Router();
const { getTopics } = require("../controllers/controllers.js")

apiRouter.get("/", getTopics)

module.exports = apiRouter;