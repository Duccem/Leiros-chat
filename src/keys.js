require('dotenv').config();

module.exports = {
    port: process.env.PORT,
    database: {
        user: process.env.DATABASE_USER,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        password: process.env.DATABASE_PASSWORD
    },
    secret_key: process.env.SECRET_KEY
}