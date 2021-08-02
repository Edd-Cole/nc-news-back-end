const { selectComments } = require("../models/models.comments.js");

const getComments = (request, response, next) => {
    next();
}

module.exports = { getComments };