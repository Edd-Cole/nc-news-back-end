const { Pool } = require('pg');
const path = require('path');
const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
    path: path.resolve(__dirname, `../.environment-variables/.env.${ENV}`),
});


if (!process.env.PGDATABASE) {
    throw new Error('PGDATABASE not set');
}

console.log(`${process.env.PGDATABASE} is active`)

module.exports = new Pool();