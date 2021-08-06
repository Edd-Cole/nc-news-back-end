const db = require("../../db/connection.js");
// const format = require("pg-format")

const selectArticles = ({ sortBy, orderBy, topic, limit, page }) => {
    //SQL Injection cleansing
    sortBy = sortBy ? sortBy.replace(/\s/g, "") : "article_id";
    orderBy = orderBy ? orderBy.replace(/\s/g, "") : "ASC";
    topic = topic ? topic.replace(/\s/g, "") : "";
    limit = limit ? parseInt(limit.toString().replace(/\s/g, "")) : 10;
    page = page ? parseInt(page.toString().replace(/\s/g, "")) : 1;
    //Creating a string to insert to filter by topic so we can easily add it into the query below
    let topicString = topic ? `WHERE articles.topic = '${topic}'` : "";
    //database query
    return db.query(`
    SELECT articles.article_id, articles.title, articles.body, articles.votes, articles.topic, articles.author, articles.created_at, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    ${topicString}
    GROUP BY articles.article_id
    ORDER BY ${sortBy} ${orderBy}
    LIMIT ${limit} OFFSET ${(page-1)*limit}`)
        .then(articles => {
            return articles.rows;
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

const updateArticleByID = async(article_id, articleInfo) => {
    //SQL Injection Sanitisation - remove single quotes, or double them up
    article_id = article_id.replace(/\'/g, "")
    for (item in articleInfo) {
        if (item !== "votes" && item !== "inc_votes") {
            articleInfo[item] = articleInfo[item].replace(/\'/g, '\'\'')
        }
    }
    //Checks that if only invalid values are used, then we get the article
    let { title, body, votes, topic, author, inc_votes = 0 } = articleInfo;
    const articleInfoValues = Object.values({ title, body, votes, topic, author, inc_votes })
    if (articleInfoValues.every(info => info === undefined)) {
        return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id])
            .then(response => {
                return response.rows;
            })
    }
    //Grab the value of votes for this article, and then pass that to the update below so we
    //can manipulate the information with inc_votes, as needed
    const votesValue = await db.query("SELECT votes FROM articles WHERE article_id = $1", [article_id])
        .then(votes => {
            if (votes.rows.length === 0) {
                return Promise.reject({ code: 404, msg: "article does not exist" })
            }
            return votes.rows[0].votes
        });
    //Create the SQL SET statement using the information from PATCH
    title = title ? `title = '${title}',` : "";
    body = body ? `body = '${body}',` : "";
    votes = votes ? `votes = '${votes + inc_votes}',` : `votes = '${votesValue + inc_votes}',`;
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
            return response.rows[0];
        })
}

const selectCommentsByArticleID = (article_id, { limit = 10, page = 1 }) => {
    return db.query(`
    SELECT comment_id, articles.title, comments.author, articles.article_id, comments.votes, comments.body
    FROM articles
    JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    LIMIT ${limit} OFFSET ${(page - 1)*limit}`, [article_id])
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