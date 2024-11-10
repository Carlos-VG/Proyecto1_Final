require('dotenv').config();

module.exports = {
    app: {
        port: process.env.PORT
    },
    centralAccess: {
        url: process.env.CENTRAL_ACCESS_URL,
        username: process.env.CENTRAL_ACCESS_USERNAME,
        password: process.env.CENTRAL_ACCESS_PASSWORD
    }
}