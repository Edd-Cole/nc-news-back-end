const { selectUsers } = require("../models/models.users.js");

const getUsers = (request, response, next) => {
    next();
}

module.exports = { getUsers };