const apiArticles = require("express").Router();
const { getArticles, getArticleByID, patchArticleByID, getCommentsByArticleID, postCommentByArticleID, postArticle, deleteArticleByID, getArticleByTitle } = require("../controllers/controllers.articles.js")

apiArticles.route("/")
    .get(getArticles)
    .post(postArticle);


apiArticles.route("/:article_id")
    .get(getArticleByID)
    .patch(patchArticleByID)
    .delete(deleteArticleByID)

apiArticles.route("/:title")
    .get(getArticleByTitle)

apiArticles.route("/:article_id/comments")
    .get(getCommentsByArticleID)
    .post(postCommentByArticleID)

module.exports = apiArticles;