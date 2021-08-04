const { selectArticles, selectArticleByID, updateArticleByID, selectCommentsByArticleID, addCommentByArticleID, addArticle } = require("../models/models.articles.js");

const getArticles = (request, response, next) => {
    const queries = request.query
    selectArticles(queries)
        .then((articles) => {
            if (articles.length === 0) {
                next({ code: 400, msg: "Invalid query" })
            } else {
                response.status(200).send({ articles });
            }
        })
        .catch(error => {
            if (error.code = 42703) {
                next({ code: 400, msg: "Invalid query" })
            } else {
                console.log(error)
                next(error)
            }
        })
}

const getArticleByID = (request, response, next) => {
    const { article_id } = request.params;
    selectArticleByID(article_id)
        .then(articles => {
            if (articles.length === 0) {
                next({ code: 404, msg: "article_id does not exist" });
            } else {
                response.status(200).send({ articles })
            }
        })
        .catch(error => {
            next({ code: 400, msg: "article_id is not of correct type" });
        })
}

const patchArticleByID = (request, response, next) => {
    const { article_id } = request.params;
    const articleInfo = request.body;
    updateArticleByID(article_id, articleInfo)
        .then(articles => {
            //Handles edge cases where errors would pass tests
            if (articles.code) {
                return next(articles)
            }
            response.status(200).send({ articles })
        })
        .catch(error => {
            //Handles errors
            if (error.code === "23503") {
                next({ code: 400, msg: "cannot create an original value for topic and/or author" })
            } else if (error.code === "22001") {
                next({ code: 400, msg: "at least one value exceeds character limit" })
            } else if (error.code === "22P02") {
                next({ code: 400, msg: "invalid type for key" })
            } else {
                next(error)
            }
        })
}

const getCommentsByArticleID = (request, response, next) => {
    const { article_id } = request.params
    const commentsInfo = request.query
    selectCommentsByArticleID(article_id, commentsInfo)
        .then(comments => {
            //Implicit error handling - code does not throw errors
            if (comments.length === 0) {
                return next({ code: 404, msg: "article does not exist" })
            } else {
                response.status(200).send({ comments })
            }
        })
        .catch(error => {
            //Explicit error handling - code does throw erros
            if (error.code = "22P02") {
                next({ code: 400, msg: "invalid type for endpoint" })
            } else {
                console.log(error)
                next();
            }
        })
}

const postCommentByArticleID = (request, response, next) => {
    const commentInfo = request.body;
    const { article_id } = request.params
    addCommentByArticleID(article_id, commentInfo)
        .then(comments => {
            response.status(201).send({ comments });
        })
        .catch(error => {
            if (error.code === "23502") {
                next({ code: 400, msg: "author and body must be specified" })
            } else if (error.code === "23503") {
                next({ code: 400, msg: "author must reference a username, article_id must exist and body must be of type String" })
            } else if (error.code === "22P02") {
                next({ code: 400, msg: "article_id must be a number" })
            } else {
                console.log(error)
                next(error)
            }
        })
}

const postArticle = (request, response, next) => {
    const body = request.body;
    addArticle(body)
        .then(articles => {
            response.status(201).send({ articles })
        })
        .catch(error => {
            if (error.code === "23502") {
                next({ code: 400, msg: "ensure object is {title: String, body: String, author: String, topic: String}" })
            } else if (error.code === "23503") {
                next({ code: 400, msg: "author and topic must exist" })
            } else {
                next(error)
            }
        })
}

module.exports = {
    getArticles,
    getArticleByID,
    patchArticleByID,
    getCommentsByArticleID,
    postCommentByArticleID,
    postArticle
};