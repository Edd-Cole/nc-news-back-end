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

const removeComment = (comment_id) => {
    return db.query("DELETE FROM comments WHERE comment_id = $1", [comment_id])
        .then(() => { return })
}

const updateComment = async(comment_id, votes) => {
    console.log(votes)
    let commentVotes = await db.query(`SELECT votes FROM comments WHERE comment_id = $1;`, [comment_id]);

    console.log(commentVotes.rows[0].votes, votes)
    commentVotes = parseInt(commentVotes.rows[0].votes) + votes;
    console.log(commentVotes)


    return db.query(`UPDATE comments 
    SET votes = $2
    WHERE comment_id = $1
    RETURNING *;`, [comment_id, commentVotes])
    .then(comments => {
        return comments.rows;
    })
}

module.exports = { selectComments, removeComment, updateComment };