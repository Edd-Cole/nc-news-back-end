const apiUsers = require("express").Router();
const { getUsers, getUserByUsername } = require("../controllers/controllers.users.js");

apiUsers.route("/").get(getUsers);
apiUsers.route("/:username")
    .get(getUserByUsername)
    // .delete(deleteUserByUsername)

module.exports = apiUsers;