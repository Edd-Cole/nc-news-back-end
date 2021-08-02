const { selectArticles } = require("../models/models.articles.js");

const getArticles = (request, response, next) => {
    selectArticles()
        .then((articles) => {
            response.status(200).send({ articles });
        });
}

module.exports = { getArticles };