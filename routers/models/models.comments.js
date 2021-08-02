const db = require("../../db/connection.js");

const selectComments = () => {
    return db.query(`SELECT comment_id, comments.author, title, comments.votes, comments.body
    FROM comments JOIN articles
    ON comments.article_id = articles.article_id;`)
        .then(comments => {
            return comments.rows;
        })
}

module.exports = { selectComments };