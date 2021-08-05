const apiUsers = require("express").Router();
const { getUsers, getUserByUsername, deleteUserByUsername } = require("../controllers/controllers.users.js");

apiUsers.route("/").get(getUsers);
apiUsers.route("/:username")
    .get(getUserByUsername)
    .delete(deleteUserByUsername)

module.exports = apiUsers;