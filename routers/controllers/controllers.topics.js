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

const patchTopicByID = (request, response, next) => {
    const { slug } = request.params
    const { slug: invalidSlug, description } = request.body;
    //slug error catching
    if (invalidSlug) {
        return next({ code: 400, msg: "cannot change slug" })
    }
    //transferring to models
    updateTopicByID(slug, description)
        .then(topics => {
            if (topics.length === 0) {
                next({ code: 400, msg: "slug does not exist" })
            } else {
                response.status(200).send({ topics })
            }
        })
        .catch(error => {
            if (error.code === "42601") {
                next({ code: 400, msg: "slug does not exist" })
            } else {
                console.log(error)
                next(error)
            }
        })
}

const deleteTopicByID = (request, response, next) => {
    removeTopicByID
}

module.exports = { getTopics, postTopic, patchTopicByID, deleteTopicByID };