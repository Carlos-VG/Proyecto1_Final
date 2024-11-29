require('dotenv').config();

module.exports = {
    app: {
        port: process.env.PORT
    },
    centralAccess: {
        url: process.env.CENTRAL_ACCESS_URL,
        itopversion: process.env.ITOP_VERSION,
    },
    jwt: {
        secret: process.env.JWT_SECRET
    }
}