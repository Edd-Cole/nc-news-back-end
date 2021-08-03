const fs = require("fs/promises")

const selectEndpoints = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8")
        .then(endpoints => {
            return endpoints;
        })
}

module.exports = selectEndpoints;