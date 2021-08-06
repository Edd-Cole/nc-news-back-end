const app = require("./app.js");

const { PORT = 7070 } = process.env;

app.listen(PORT, () => {
    console.log("server is listening on ${PORT}...")
})