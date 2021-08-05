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

const removeUserByUsername = async(username) => {
    await db.query(`
    UPDATE comments
    SET author = 'deleted_user'
    WHERE author = $1;
    `, [username])
    await db.query(`
            UPDATE articles
            SET author = 'deleted_user'
            WHERE author = $1;
            `, [username])
    return db.query(`
            DELETE FROM users
            WHERE username = $1;
            `, [username])
}

const updateUserByUsername = async(userName, { username, avatar_url, name }) => {
    //build update string query for insertion below
    username = username ? `username = '${username}',` : "";
    avatar_url = avatar_url ? `avatar_url = '${avatar_url}',` : "";
    name = name ? `name = '${name}',` : "";
    let updateUserString = `${username}${avatar_url}${name}`.slice(0, -1)
        // database query to update the user
    return db.query(`
    UPDATE users
    SET ${updateUserString}
    WHERE username = '${userName}'
    RETURNING *;
    `)
        .then(users => {
            return users.rows
        })
}

const addUser = ({ username, name, avatar_url = "no_avatar" }) => {
    return db.query(`
    INSERT INTO users
        (username, avatar_url, name)
    VALUES
        ($1, $2, $3)
    RETURNING *;
    `, [username, avatar_url, name])
        .then(users => {
            return users.rows
        })
}


module.exports = { selectUsers, selectUserByUsername, removeUserByUsername, addUser, updateUserByUsername };