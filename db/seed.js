const db = require("./connection.js")
const format = require("pg-format")
const { createRefTable, replaceBelongsToWithArticleID, formatArray } = require("./utils/data-manipulation.js")

const seed = async(data) => {
    const { articleData, commentData, topicData, userData } = data;
    //Dropping Tables - comments, articles, users & topics, respectively
    await db.query("DROP TABLE IF EXISTS comments;");
    await db.query("DROP TABLE IF EXISTS articles;");
    await db.query("DROP TABLE IF EXISTS users;");
    await db.query("DROP TABLE IF EXISTS topics;");
    //Table Creation - topics, users, articles & comments, respectively
    await Promise.all([
        db.query(`CREATE TABLE topics (
        slug VARCHAR(63) PRIMARY KEY,
        description TEXT NOT NULL
    );`),
        db.query(`CREATE TABLE users (
        username VARCHAR(40)PRIMARY KEY,
        avatar_url VARCHAR,
        name VARCHAR(60) NOT NULL
    );`)
    ])
    await db.query(`CREATE TABLE articles (
                article_id SERIAL PRIMARY KEY,
                title VARCHAR(127) NOT NULL,
                body TEXT,
                votes INT DEFAULT 0,
                topic VARCHAR(63) REFERENCES topics (slug) ON DELETE CASCADE NOT NULL,
                author VARCHAR(40) REFERENCES users (username) ON DELETE CASCADE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`);
    await db.query(`CREATE TABLE comments (
                    comment_id SERIAL PRIMARY KEY,
                    author VARCHAR(40) REFERENCES users (username) ON DELETE CASCADE NOT NULL,
                    article_id INT REFERENCES articles (article_id) ON DELETE CASCADE NOT NULL,
                    votes INT DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    body TEXT NOT NULL
                );`);
    //Data Insertion - Data
    const topicsArray = formatArray(topicData, ["slug", "description"]);
    const topicsStringFormat = format(`INSERT INTO topics
                    (slug, description)
                VALUES
                    %L;`, topicsArray);
    await db.query(topicsStringFormat);
    //Data Insertion - Users
    const usersArray = formatArray(userData, ["username", "avatar_url", "name"])
    const usersStringFormat = format(`INSERT INTO users 
                (username, avatar_url, name)
            VALUES
                %L;`, usersArray);
    await db.query(usersStringFormat);
    //Data Insertion - Articles
    const articlesArray = formatArray(articleData, ["title", "body", "votes", "topic", "author", "created_at"])
    const articlesStringFormat = format(`INSERT INTO articles
                (title, body, votes, topic, author, created_at)
            VALUES
                %L;`, articlesArray);
    await db.query(articlesStringFormat);
    //Data Insertion - Comments
    const articleInformation = await db.query("SELECT * FROM articles;")
    const articleRefTable = createRefTable(articleInformation.rows, "title", "article_id");
    const preparedCommentData = replaceBelongsToWithArticleID(commentData, articleRefTable);
    const commentsArray = formatArray(preparedCommentData, ["created_by", "article_id", "votes", "created_at", "body"]);
    const commentsStringFormat = format(`INSERT INTO comments
                (author, article_id, votes, created_at, body)
            VALUES
                %L;`, commentsArray);
    await db.query(commentsStringFormat);
};

module.exports = seed;