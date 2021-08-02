const apiUsers = require("express").Router();
const { getUsers } = require("../controllers/controllers.users.js");

apiUsers.get("/", getUsers);

module.exports = apiUsers;