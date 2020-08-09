const { createPool } = require('mysql2/promise');
const { database } = require('./keys');
let connection;
connection = createPool(database);

function getConnection(){
    return connection;
}

module.exports = { getConnection }

