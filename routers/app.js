const express = require("express");
const apiRouter = require("./routes/api-router.js")
const apiError = require("./error-routes/api-errors.js")

const app = express();
app.use(express.json());

app.use("/api", apiRouter)

app.use(apiError)

module.exports = app;