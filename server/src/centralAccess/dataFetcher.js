const axios = require('axios');
const https = require('https');
const config = require('../config');

async function getAll(className, key, username, password, operation = 'core/get') {
    const url = config.centralAccess.url;
    const auth = { username, password };
    const itopversion = config.centralAccess.itopversion;
    const json_data = encodeURIComponent(JSON.stringify({
        operation,
        class: className,
        key
    }));
    const fullUrl = `${url}?version=${itopversion}&json_data=${json_data}`;

    const response = await axios.get(fullUrl, {
        auth,
        timeout: 10000,
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        })
    });

    return response.data;
}

module.exports = {
    getAll
}
