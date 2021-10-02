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
        .catch(error => {
            return Promise.reject(error)
        })
}

const updateTopicByID = async(slug, invalidSlug, description) => {
    if (invalidSlug) {
        return Promise.reject({ code: 400, msg: "Invalid data received" })
    }
    await db.query("SELECT slug FROM topics WHERE slug = $1", [slug])
        .then(response => {
            if (response.rows.length === 0) return Promise.reject({ code: 400, msg: "Invalid endpoint" })
        })
    return db.query(`
    UPDATE topics
    SET description = '${description}'
    WHERE slug = '${slug}'
    RETURNING *;
    `)
        .then(topics => {
            return topics.rows
        })
        .catch(error => {
            return Promise.reject(error)
        })
}

const removeTopicByID = async(slug) => {
    await db.query("SELECT slug FROM topics WHERE slug = $1", [slug])
        .then(topics => {
            if (topics.rows.length === 0) {
                return Promise.reject({ code: 404, msg: "Invalid endpoint" })
            }
        })

    return db.query("DELETE FROM topics WHERE slug = $1", [slug])
        .then(topics => {
            return topics.rows;
        })
}

const selectTopicByID = (slug) => {
    return db.query(`
        SELECT * FROM topics WHERE slug = $1;
    `, [slug])
    .then(data => {
        if(!data.rows[0]) return Promise.reject({ code: 404, msg: "Endpoint does not exist"})
        return data.rows[0];
    })
}

module.exports = { selectTopics, addTopic, updateTopicByID, removeTopicByID, selectTopicByID }