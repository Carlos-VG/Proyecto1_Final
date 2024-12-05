const axios = require('axios');
const https = require('https');
const config = require('../config');

/**
 * Realiza una consulta a una API central para obtener datos de una clase específica.
 * @async
 * @function getAll
 * @param {string} className - El nombre de la clase que se desea consultar.
 * @param {string} key - La clave para filtrar los resultados.
 * @param {string} username - El nombre de usuario para la autenticación básica.
 * @param {string} password - La contraseña para la autenticación básica.
 * @param {string} [operation='core/get'] - La operación a realizar (por defecto es 'core/get').
 * @returns {Promise<Object>} Los datos obtenidos de la API en formato JSON.
 * @throws {Error} Lanza un error si la solicitud falla o excede el tiempo de espera.
 */
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

/**
 * Exporta las funciones del módulo.
 * @module apiCentral
 */
module.exports = {
    getAll
}
