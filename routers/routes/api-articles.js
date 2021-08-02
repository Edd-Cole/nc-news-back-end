const apiArticles = require("express").Router();
const { getArticles } = require("../controllers/controllers.articles.js")

apiArticles.get("/", getArticles);

module.exports = apiArticles;