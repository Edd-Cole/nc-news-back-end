const db = require("../../db/connection.js");

const selectArticles = () => {
    return db.query("SELECT * FROM articles")
        .then(articles => {
            return articles.rows;
        })
}

module.exports = { selectArticles };