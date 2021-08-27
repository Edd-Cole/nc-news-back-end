const { selectArticles, selectArticleByID, updateArticleByID, selectCommentsByArticleID, addCommentByArticleID, addArticle, removeArticleByID, selectArticleByTitle } = require("../models/models.articles.js");

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
    console.log("issue!!!!")
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
            next(error)
        })
}

const getArticleByTitle = (request, response, next) => {
    let { title } = request.params;
    if (!/[a-z]/gi.test(title)) {
        return next(request)
    }

    title = title.replace(/\_/g, " ");

    selectArticleByTitle(title)
        .then(articles => {
            response.status(200).send(articles)
        })
        .catch((error) => {
            console.log(error)
            next(request)
        })
}

module.exports = {
    getArticles,
    getArticleByID,
    patchArticleByID,
    getCommentsByArticleID,
    postCommentByArticleID,
    postArticle,
    deleteArticleByID,
    getArticleByTitle
};