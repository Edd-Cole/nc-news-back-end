const db = require("../connection.js")
const format = require("pg-format")
const { formatTopics } = require("../utils/data-manipulation.js")

const seed = async(data) => {
    const { articleData, commentData, topicData, userData } = data;
    //Dropping Tables
    await db.query("DROP TABLE IF EXISTS comments CASCADE;");
    await db.query("DROP TABLE IF EXISTS articles CASCADE;");
    await db.query("DROP TABLE IF EXISTS users CASCADE;");
    await db.query("DROP TABLE IF EXISTS topics CASCADE;");
    //Table Creation
    await db.query(`CREATE TABLE topics (
        slug VARCHAR(63) PRIMARY KEY NOT NULL,
        description TEXT
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
            topic TEXT REFERENCES topics (slug) NOT NULL,
            author VARCHAR(40) REFERENCES users (username) NOT NULL,
            created_at TIME DEFAULT CURRENT_TIME,
            created_on DATE DEFAULT CURRENT_DATE
        )`)
    await db.query(`CREATE TABLE comments (
            comment_id SERIAL PRIMARY KEY NOT NULL,
            author VARCHAR(40) REFERENCES users (username) NOT NULL,
            article_id INT REFERENCES articles (article_id) NOT NULL,
            votes INT DEFAULT 0,
            created_at TIME DEFAULT CURRENT_TIME,
            created_on DATE DEFAULT CURRENT_DATE,
            body TEXT NOT NULL
        )`)

    //Data Insertion
    const topicsArray = formatTopics(topicData);
    const topicsStringFormat = format(`INSERT INTO topics
            (slug, description)
        VALUES
            %L`, topicsArray)
    await db.query(topicsStringFormat)


    //Need to create users Array from data!!!!!!
    const usersArray = formatUsers(userData)
    const usersStringFormat = format(`INSERT INTO users 
            (username, avatar_url, name)
        VALUES
            %L`, usersArray)
    await db.query(usersStringFormat)

    // return db.query("SELECT * FROM topics;").then((topics) => { console.log(topics.rows) })
};

module.exports = seed;