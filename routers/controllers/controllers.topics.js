const { selectTopics, addTopic } = require("../models/models.topics.js");

const getTopics = (request, response, next) => {
    selectTopics()
        .then((topics) => {
            response.status(200).send({ topics })
        })
}

const postTopic = (request, response, next) => {
    const { body } = request
    addTopic(body)
        .then(topics => {
            response.status(201).send({ topics })
        })
        .catch(error => {
            if (error.code === "23502") {
                next({ code: 400, msg: "slug and description must be defined" })
            } else if (error.code === "23505") {
                next({ code: 400, msg: "slug already exists" })
            } else {
                console.log(error)
                next(error)
            }
        })
}

module.exports = { getTopics, postTopic };