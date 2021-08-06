const fs = require("fs");

fs.writeFile(`${__dirname}/../../.env.development`, "PGDATABASE=nc_news", (error) => {
    if (error) {
        return error;
    } else {
        return
    }
})

fs.writeFile(`${__dirname}/../../.env.test`, "PGDATABASE=nc_news_test", (error) => {
    if (error) {
        return error;
    } else {
        return
    }
})