const apiComments = require("express").Router();
const { getComments } = require("../controllers/controllers.comments.js");

apiComments.get("/", getComments);

module.exports = apiComments;