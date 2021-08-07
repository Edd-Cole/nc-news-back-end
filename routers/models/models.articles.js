const db = require("../../db/connection.js");
const articles = require("../../db/data/test-data/articles.js");

const selectArticles = async({ sort_by = "created_at", order_by = "DESC", topic, limit = 10, page = 1 }) => {
    const topics = await db.query("SELECT slug FROM topics;")
        .then(response => {
            const topics = response.rows.map(topic => topic.slug)
            topics.push(undefined)
            return topics
        }).then(topics => {
            if (!topics.includes(topic)) return Promise.reject({ code: 404, msg: "Invalid query" })
        })
        .catch(error => {
            return Promise.reject(error)
        })
    let topicString = topic ? `WHERE articles.topic = '${topic}'` : "";
    page = (page - 1) * limit;

    return db.query(`
    SELECT articles.article_id, articles.title, articles.body, articles.votes, articles.topic, articles.author, articles.created_at, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    ${topicString}
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order_by}
    LIMIT ${limit} OFFSET ${page};`)
        .then(articles => {
            return articles.rows
        })
        .catch(error => {
            return Promise.reject(error)
        })
}

const selectArticleByID = (article_id) => {
    return db.query(`
    SELECT articles.article_id, articles.title, articles.body, articles.votes, articles.topic,
    articles.author, articles.created_at, COUNT(comments.comment_id) AS comment_count
    FROM articles
    JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    `, [article_id])
        .then(response => {
            return response.rows[0];
        })
}

const updateArticleByID = async(article_id, inc_votes) => {
    if (!parseInt(article_id)) return Promise.reject({ code: 400, msg: "Invalid endpoint" })
    let votes = await db.query("SELECT votes FROM articles WHERE article_id = $1", [article_id])
        .then(articles => {
            if (articles.rows.length !== 0) {
                return articles.rows[0].votes
            } else {
                return Promise.reject({ code: 404, msg: "Endpoint does not exist" })
            }
        })

    votes += inc_votes;
    return db.query(`
        UPDATE articles
        SET votes = $2
        WHERE article_id = $1
        RETURNING *;`, [article_id, votes])
        .then(articles => {
            console.log(articles)
            return articles.rows[0]
        })
        .catch(error => {
            return Promise.reject({ code: 400, msg: "Invalid object" })
        })
}

const selectCommentsByArticleID = async(article_id, { limit = 10, page = 1 }) => {
    await db.query("SELECT article_id FROM articles WHERE article_id = $1", [article_id])
        .catch(error => {
            console.log(error)
            return Promise.reject({ code: 400, msg: "Invalid type for endpoint" })
        })
        .then(article => {
            if (article.rows[0] === undefined) {
                return Promise.reject({ code: 404, msg: "article does not exist" })
            }
        })
    limit = parseInt(limit);
    page = parseInt((page - 1) * limit);
    return db.query(`
    SELECT comment_id, articles.title, comments.author, articles.article_id, comments.votes, comments.body
    FROM articles
    JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    LIMIT ${limit} OFFSET ${page}`, [article_id])
        .then(response => {
            console.log(response.rows)
            return response.rows;
        })
        .catch(error => {
            return Promise.reject(error)
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

const addArticle = ({ title, body, topic, author }) => {
    return db.query(`
    INSERT INTO articles
        (title, body, votes, topic, author)
    VALUES
        ($1, $2, 0, $3, $4)
    RETURNING *;
    `, [title, body, topic, author])
        .then(articles => {
            return articles.rows;
        })
}

const removeArticleByID = async(article_id) => {
    await db.query(`
    DELETE FROM comments
    WHERE article_id = $1`, [article_id])

    await db.query(`
    DELETE FROM articles 
    WHERE article_id = $1;`, [article_id])
        .then(articles => { return articles })
}

module.exports = {
    removeArticleByID,
    selectArticles,
    selectArticleByID,
    updateArticleByID,
    selectCommentsByArticleID,
    addCommentByArticleID,
    addArticle
};