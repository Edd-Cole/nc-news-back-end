const apiUsers = require("express").Router();
const { getUsers, getUserByUsername, postUser } = require("../controllers/controllers.users.js");

apiUsers.route("/")
    .get(getUsers)
    .post(postUser)
apiUsers.route("/:username")
    .get(getUserByUsername)
    // .delete(deleteUserByUsername)

module.exports = apiUsers;