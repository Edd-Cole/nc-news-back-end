const apiUsers = require("express").Router();
const { getUsers, getUserByUsername, deleteUserByUsername, postUser, patchUserByUsername } = require("../controllers/controllers.users.js");

apiUsers.route("/")
    .get(getUsers)
    .post(postUser)

apiUsers.route("/:username")
    .get(getUserByUsername)
    .patch(patchUserByUsername)
    .delete(deleteUserByUsername)

module.exports = apiUsers;