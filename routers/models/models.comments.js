const db = require("../../db/connection.js");

const selectComments = ({ limit = 20, page = 1 }) => {
    return db.query(`SELECT comment_id, comments.author, title, comments.votes, comments.body
    FROM comments
    LEFT JOIN articles
    ON comments.article_id = articles.article_id
    LIMIT ${limit} OFFSET ${(page - 1)*limit};`)
        .then(comments => {
            return comments.rows;
        })
}

module.exports = { selectComments };