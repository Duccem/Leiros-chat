const { createPool } = require('mysql2');

let connection
connection = createPool({
    database: 'chat',
    host:'localhost',
    user:'root',
    port:'3306'
});


function getConnection(){
    return connection;
}

module.exports = { getConnection }

