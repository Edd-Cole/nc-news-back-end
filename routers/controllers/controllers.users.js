const { selectUsers } = require("../models/models.users.js");

const getUsers = (request, response, next) => {
    selectUsers()
        .then(users => {
            response.status(200).send({ users });
        })
}

module.exports = { getUsers };