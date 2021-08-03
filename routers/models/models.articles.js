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
    //Create the SQL SET statement using the information from PATCH
    let { title, body, votes, topic, author } = articleInfo;
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
            return response.rows;
        })
}

module.exports = { selectArticles, selectArticleByID, updateArticleByID };