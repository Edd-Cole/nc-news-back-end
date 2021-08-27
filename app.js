const express = require("express");
const apiRouter = require("./routers/routes/api-router.js");
const { apiError, psqlError, fatalError } = require("./routers/error-routes/api-errors.js");
const cors = require("cors");

const app = express();
app.use(cors())
app.use(express.json());

app.use("/api", apiRouter);

app.use(apiError)
app.use(psqlError);
app.use(fatalError);

module.exports = app;