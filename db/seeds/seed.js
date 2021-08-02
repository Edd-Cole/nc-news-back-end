const db = require("../connection.js")

const seed = async(data) => {
    const { articleData, commentData, topicData, userData } = data;
    // 1. create tables
    await db.query("DROP TABLE IF EXISTS topics;");
    await db.query("DROP TABLE IF EXISTS articles;");
    await db.query("DROP TABLE IF EXISTS users;");
    await db.query("DROP TABLE IF EXISTS comments;");
    await db.query(`CREATE TABLE topics (
        slug TEXT PRIMARY KEY NOT NULL,
        description TEXT
    );`);
    await db.query(`CREATE TABLE users (
        username VARCHAR(40)PRIMARY KEY NOT NULL,
        avatar_url VARCHAR,
        name VARCHAR(60) NOT NULL,
    )`)
    await db.query(`CREATE TABLE article (
        article_id SERIAL NOT NULL PRIMARY KEY,
        title VARCHAR(127) NOT NULL,
        body TEXT,
        votes INT NOT NULL DEFAULT 0,
        topic FOREIGN ID REFERENCES topics (slug) NOT NULL,
        author FOREIGN ID REFERENCES users (username) NOT NULL,
        created_at TIME DEFAULT CURRENT_TIME,
        created_on DATE DEFAULT CURRENT_DATE
    )`)
    await db.query(`CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY NOT NULL,
        author FOREIGN ID REFERENCES users (username) NOT NULL,
        article_id FOREIGN ID REFERENCES articles (article_id) NOT NULL,
        votes INT DEFAULT 0,
        created_at TIME DEFAULT CURRENT_TIME,
        created_on DATE DEFAULT CURRENT_DATE,
        body TEXT NOT NULL
    )`)
        // 2. insert data
};

module.exports = seed;