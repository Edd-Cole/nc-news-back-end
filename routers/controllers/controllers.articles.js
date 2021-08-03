const { selectArticles, selectArticleByID, updateArticleByID } = require("../models/models.articles.js");

const getArticles = (request, response) => {
    selectArticles()
        .then((articles) => {
            response.status(200).send({ articles });
        });
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
            response.status(200).send({ articles })
        })
}

module.exports = { getArticles, getArticleByID, patchArticleByID };