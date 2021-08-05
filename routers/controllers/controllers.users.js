const { selectUsers, selectUserByUsername, removeUserByUsername, addUser } = require("../models/models.users.js");

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

// const deleteUserByUsername = (request, response, next) => {
//     const { username } = request.params
//     removeUserByUsername(username)
//         .then(users => {
//             response.sendStatus(204)
//         })
//         .catch(error => {
//             console.log(error)
//             next(error)
//         })
// }

const postUser = (request, response, next) => {
    const { body } = request
    addUser(body)
        .then(users => {
            response.status(201).send({ users })
        })
        .catch(error => {
            if (error.code === "23502") {
                next({ code: 400, msg: "user already exists" })
            } else {
                next(error)
            }
        })
}

module.exports = { getUsers, getUserByUsername, postUser };