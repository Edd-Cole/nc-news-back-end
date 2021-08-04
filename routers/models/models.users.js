const db = require("../../db/connection.js");

const selectUsers = () => {
    return db.query("SELECT username, avatar_url FROM users;")
        .then(users => {
            return users.rows;
        })
}

const selectUserByUsername = (username) => {
    return db.query(`SELECT * FROM users WHERE username = $1`, [username])
        .then(users => {
            if (users.rows.length === 0) {
                return { code: 404, msg: "user does not exist" }
            } else {
                return users.rows[0];
            }
        })
}

module.exports = { selectUsers, selectUserByUsername };