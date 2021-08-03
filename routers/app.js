const express = require("express");
const apiRouter = require("./routes/api-router.js")

const app = express();
app.use(express.json());

app.use("/api", apiRouter)

app.use((error, request, response, next) => {
    if (error.code === 400) {
        response.status(400).send(error);
    } else if (error.code === 404) {
        response.status(404).send(error)
    } else {
        response.sendstatus(500);
    }
})

module.exports = app;