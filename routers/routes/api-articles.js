const apiArticles = require("express").Router();
const { getArticles, getArticleByID, patchArticleByID } = require("../controllers/controllers.articles.js")

apiArticles.get("/", getArticles);
apiArticles.get("/:article_id", getArticleByID);
apiArticles.patch("/:article_id", patchArticleByID);

module.exports = apiArticles;