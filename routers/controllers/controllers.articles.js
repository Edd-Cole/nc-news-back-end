const { selectArticles, selectArticleByID, updateArticleByID, selectCommentsByArticleID, addCommentByArticleID, addArticle, removeArticleByID } = require("../models/models.articles.js");

const getArticles = (request, response, next) => {
    const queries = request.query
    selectArticles(queries)
        .then((articles) => {
            response.status(200).send({ articles });
        })
        .catch(error => {
            next(error)
        })

}

const getArticleByID = (request, response, next) => {
    const { article_id } = request.params;
    selectArticleByID(article_id)
        .then(articles => {
            response.status(200).send(articles)
        })
        .catch(error => {
            next(error)
        })
}

const patchArticleByID = (request, response, next) => {
    const { article_id } = request.params;
    const { inc_votes } = request.body;
    updateArticleByID(article_id, inc_votes)
        .then(articles => {
            response.status(200).send(articles)
        })
        .catch(error => {
            next(error)
        })
}

const getCommentsByArticleID = (request, response, next) => {
    const { article_id } = request.params
    const commentsInfo = request.query
    selectCommentsByArticleID(article_id, commentsInfo)
        .then(comments => {
            response.status(200).send({ comments })
        })
        .catch(error => {
            next(error);
        })
}

const postCommentByArticleID = (request, response, next) => {
    const commentInfo = request.body;
    const { article_id } = request.params
    addCommentByArticleID(article_id, commentInfo)
        .then(comments => {
            response.status(201).send(comments);
        })
        .catch(error => {
            next(error)
        })
}

const postArticle = (request, response, next) => {
    const body = request.body;
    addArticle(body)
        .then(articles => {
            response.status(201).send({ articles })
        })
        .catch(error => {
            next(error)
        })
}

const deleteArticleByID = (request, response, next) => {
    const { article_id } = request.params
    removeArticleByID(article_id)
        .then(articles => {
            response.sendStatus(204);
        })
        .catch(error => {
            if (error.code === "22P02") {
                next({ code: 400, msg: "article_id must be a Number" })
            } else {
                console.log(error)
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
    postArticle,
    deleteArticleByID
};