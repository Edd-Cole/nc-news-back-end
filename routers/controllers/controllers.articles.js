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
    selectArticleByID(article_id)
        .then(articles => {
            if (!articles) {
                next({ code: 404, msg: "article_id does not exist" });
            } else {
                response.status(200).send(articles)
            }
        })
        .catch(error => {
            next({ code: 400, msg: "article_id is not of correct type" });
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
            console.log(comments)
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