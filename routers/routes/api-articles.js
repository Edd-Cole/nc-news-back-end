const apiArticles = require("express").Router();
const { getArticles, getArticleByID, patchArticleByID, getCommentsByArticleID, postCommentByArticleID } = require("../controllers/controllers.articles.js")

apiArticles.get("/", getArticles);
apiArticles.get("/:article_id", getArticleByID);
apiArticles.patch("/:article_id", patchArticleByID);
apiArticles.get("/:article_id/comments", getCommentsByArticleID)
apiArticles.post("/:article_id/comments", postCommentByArticleID)

module.exports = apiArticles;