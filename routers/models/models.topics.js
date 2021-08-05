const db = require("../../db/connection.js");

const selectTopics = () => {
    return db.query("SELECT * FROM topics;")
        .then((topics) => {
            return topics.rows;
        })
}

const addTopic = ({ slug, description }) => {
    return db.query(`
    INSERT INTO topics
        (slug, description)
    VALUES
        ($1, $2)
    RETURNING *;
    `, [slug, description])
        .then(topics => {
            return topics.rows[0]
        })
}

const updateTopicByID = (slug, invalidSlug, description) => {
    return db.query(`
    UPDATE topics
    SET description = '${description}'
    WHERE slug = '${slug}'
    RETURNING *;
    `)
        .then(topics => {
            return topics.rows
        })
}

module.exports = { selectTopics, addTopic, updateTopicByID }