const express = require("express");
const apiRouter = require("./routes/api-router.js")

const app = express();
app.use(express.json());

app.use("/api", apiRouter)

app.use((error, request, response, next) => {
    if (error.code) {
        console.error(error);
        response.status(400).send(error.msg);
    } else {
        response.sendstatus(500);
    }
})

module.exports = app;