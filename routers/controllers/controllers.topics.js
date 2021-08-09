const { selectTopics, addTopic, updateTopicByID, removeTopicByID } = require("../models/models.topics.js");

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
            next(error)
        })
}

const patchTopicByID = (request, response, next) => {
    const { slug } = request.params
    const { slug: invalidSlug, description } = request.body;
    updateTopicByID(slug, invalidSlug, description)
        .then(topics => {
            if (topics.length === 0) {
                next({ code: 400, msg: "slug does not exist" })
            } else {
                response.status(200).send({ topics })
            }
        })
        .catch(error => {
            next(error)
        })
}

const deleteTopicByID = (request, response, next) => {
    removeTopicByID
}

module.exports = { getTopics, postTopic, patchTopicByID, deleteTopicByID };