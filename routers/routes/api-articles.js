const apiArticles = require("express").Router();
const { getArticles, getArticleByID, patchArticleByID, getCommentsByArticleID, postCommentByArticleID } = require("../controllers/controllers.articles.js")

apiArticles.get("/", getArticles);

apiArticles.route("/:article_id")
    .get(getArticleByID)
    .patch(patchArticleByID)

apiArticles.route("/:article_id/comments")
    .get(getCommentsByArticleID)
    .post(postCommentByArticleID)

module.exports = apiArticles;