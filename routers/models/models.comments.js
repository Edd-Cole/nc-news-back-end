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

const updateComment = async(comment_id, votes, body) => {
    let commentInfo = await db.query(`SELECT votes, body FROM comments WHERE comment_id = $1;`, [comment_id])
    .then(response => {
        if(response.rows.length === 0) {
            return Promise.reject({code: 404, msg: "Endpoint does not exist"})
        }
        return response.rows[0]
    })
    .catch(error => {
        return Promise.reject(error);
    })

    //Build new update values for votes and body
    let commentVotes = parseInt(commentInfo.votes) + votes;
    let commentBody = commentInfo.body;
    
    if(body) {
        commentBody = body + " (edited)";
    } 

    //Update database with values
    return db.query(`UPDATE comments 
    SET votes = $2,
    body = $3
    WHERE comment_id = $1
    RETURNING *;`, [comment_id, commentVotes, commentBody])
    .then(comments => {
        return comments.rows;
    })
}

const selectCommentByCommentId = (comment_id) => {
    return db.query("SELECT * FROM comments WHERE comment_id = $1",[comment_id])
    .then(comment => {
        if(comment.rows.length !== 0)
            return comment.rows[0]
        else
            return Promise.reject({code: 404, msg: "Endpoint does not exist"})
    })
    .catch(error => {
        return Promise.reject(error);
    })
}

module.exports = { selectComments, removeComment, updateComment, selectCommentByCommentId };