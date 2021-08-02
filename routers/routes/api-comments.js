const apiComments = require("express").Router();
const { getComments } = require("../controllers/conrtollers.comments.js");

apiComments.get("/", getComments);

module.exports = apiComments;