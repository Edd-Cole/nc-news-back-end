const db = require("../../db/connection.js");

const selectArticles = () => {
    return db.query("SELECT * FROM articles")
        .then(articles => {
            return articles.rows;
        })
}

const selectArticleByID = (article_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id])
        .then(response => {
            return response.rows;
        })
}

const updateArticleByID = (article_id, articleInfo) => {
    //SQL Injection Sanitisation - remove single quotes, or double them up
    article_id = article_id.replace(/\'/g, "")
    for (item in articleInfo) {
        if (item !== "votes") {
            articleInfo[item] = articleInfo[item].replace(/\'/g, '\'\'')
        }
    }
    //Checks that if only invalid values are used, then we get the article
    let { title, body, votes, topic, author } = articleInfo;
    const articleInfoValues = Object.values({ title, body, votes, topic, author })
    if (articleInfoValues.every(info => info === undefined)) {
        return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id])
            .then(response => {
                return response.rows;
            })
    }
    //Create the SQL SET statement using the information from PATCH
    title = title ? `title = '${title}',` : "";
    body = body ? `body = '${body}',` : "";
    votes = votes ? `votes = '${votes}',` : "";
    topic = topic ? `topic = '${topic}',` : "";
    author = author ? `author = '${author}',` : "";
    let updateString = `${title}${body}${votes}${topic}${author}`.slice(0, -1);
    //Using the created set statement, update the table
    return db.query(`UPDATE articles
     SET ${updateString}
     WHERE article_id = '${article_id}'
     RETURNING *;`)
        .then(response => {
            if (response.rows.length === 0) {
                return { code: 404, msg: "article does not exist" }
            }
            return response.rows;
        })
}

const selectCommentsByArticleID = (article_id) => {
    return db.query(`
    SELECT comment_id, articles.title, comments.author, articles.article_id, comments.votes, comments.body
    FROM articles
    JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1`, [article_id])
        .then(response => {
            return response.rows;
        })
}

const addCommentByArticleID = (article_id, commentInfo) => {
    const { author, body } = commentInfo;
    return db.query(`
    INSERT INTO comments
        (author, article_id, body)
    VALUES
        ($1, $2, $3)
        RETURNING *;`, [author, article_id, body])
        .then(comments => {
            return comments.rows[0]
        })
}

module.exports = {
    selectArticles,
    selectArticleByID,
    updateArticleByID,
    selectCommentsByArticleID,
    addCommentByArticleID
};