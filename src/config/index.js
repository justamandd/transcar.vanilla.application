module.exports = {
    app: {
        port: process.env.PORT || 8080,
    },
    db: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: process.env.DB_CONNECT_STRING
    }
}