const { selectUsers, selectUserByUsername } = require("../models/models.users.js");

const getUsers = (request, response, next) => {
    selectUsers()
        .then(users => {
            response.status(200).send({ users });
        })
        .catch(error => {
            next(error)
        })
}

const getUserByUsername = (request, response, next) => {
    const { username } = request.params
    selectUserByUsername(username)
        .then(users => {
            //Handling implicit errors
            if (users.code) {
                next(users)
            } else {
                response.status(200).send({ users })
            }
        })
        .catch(error => {
            next(error)
        })
}

module.exports = { getUsers, getUserByUsername };