const selectEndpoints = require("../models/models.api.js")

const getEndpoints = (request, response, next) => {
    selectEndpoints()
        .then(endpoints => {
            endpoints = JSON.parse(endpoints)
            response.status(200).send({ endpoints })
        })
}

module.exports = getEndpoints