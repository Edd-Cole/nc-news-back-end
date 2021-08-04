const db = require("../connection.js")
const format = require("pg-format")
const { formatTopics, formatUsers, formatArticles, formatComments, createRefTable, replaceBelongsToWithArticleID } = require("../utils/data-manipulation.js")

const seed = async(data) => {
    const { articleData, commentData, topicData, userData } = data;
    //Dropping Tables - comments, articles, users & topics, respectively
    await db.query("DROP TABLE IF EXISTS comments CASCADE;");
    await db.query("DROP TABLE IF EXISTS articles CASCADE;");
    await db.query("DROP TABLE IF EXISTS users CASCADE;");
    await db.query("DROP TABLE IF EXISTS topics CASCADE;");
    //Table Creation - topics, users, articles & comments, respectively
    await db.query(`CREATE TABLE topics (
        slug VARCHAR(63) PRIMARY KEY NOT NULL,
        description TEXT NOT NULL
    );`);
    await db.query(`CREATE TABLE users (
        username VARCHAR(40)PRIMARY KEY NOT NULL,
        avatar_url VARCHAR,
        name VARCHAR(60) NOT NULL
    )`)
    await db.query(`CREATE TABLE articles (
                article_id SERIAL NOT NULL PRIMARY KEY,
                title VARCHAR(127) NOT NULL,
                body TEXT,
                votes INT NOT NULL DEFAULT 0,
                topic VARCHAR(63) REFERENCES topics (slug) NOT NULL,
                author VARCHAR(40) REFERENCES users (username) NOT NULL,
                created_at DATE DEFAULT CURRENT_DATE,
                created_on TIME DEFAULT CURRENT_TIME
            )`)
    await db.query(`CREATE TABLE comments (
                comment_id SERIAL PRIMARY KEY NOT NULL,
                author VARCHAR(40) REFERENCES users (username) NOT NULL,
                article_id INT REFERENCES articles (article_id) NOT NULL,
                votes INT DEFAULT 0 NOT NULL,
                created_at DATE DEFAULT CURRENT_DATE NOT NULL,
                created_on TIME DEFAULT CURRENT_TIME,
                body TEXT NOT NULL
            )`)
        //Data Insertion - Data
    const topicsArray = formatTopics(topicData);
    const topicsStringFormat = format(`INSERT INTO topics
                (slug, description)
            VALUES
                %L`, topicsArray)
    await db.query(topicsStringFormat)
        //Data Insertion - Users
    const usersArray = formatUsers(userData)
    const usersStringFormat = format(`INSERT INTO users 
            (username, avatar_url, name)
        VALUES
            %L`, usersArray)
    await db.query(usersStringFormat)
        //Data Insertion - Articles
    const articlesArray = formatArticles(articleData)
    const articlesStringFormat = format(`INSERT INTO articles
            (title, body, votes,topic, author, created_at)
        VALUES
            %L`, articlesArray)
    await db.query(articlesStringFormat)
        //Data Insertion - Comments
    const articleInformation = await db.query("SELECT * FROM articles")
    const articleRefTable = createRefTable(articleInformation.rows, "title", "article_id");
    const preparedCommentData = replaceBelongsToWithArticleID(commentData, articleRefTable);
    const commentsArray = formatComments(preparedCommentData);
    const commentsStringFormat = format(`INSERT INTO comments
            (author, article_id, votes, created_at, body)
        VALUES
            %L`, commentsArray)
    await db.query(commentsStringFormat)
};

module.exports = seed;