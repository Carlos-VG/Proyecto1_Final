const request = 'UserRequest';

/**
 * Módulo que obtiene datos de las solicitudes de usuario.
 * 
 * @module UserRequestHandler
 * 
 * @param {Object} centralAccessInjected - Un controlador opcional que se inyecta, usado para obtener datos de solicitudes de usuario.
 * Si no se inyecta, se usa el controlador por defecto `dataFetcher`.
 * 
 * @returns {Object} - Un objeto que contiene la función `getAll` para obtener los datos de las solicitudes de usuario.
 */
module.exports = function (centralAccessInjected) {
    let controller = centralAccessInjected;

    if (!controller) {
        // Si no se inyecta el controlador, se usa el controlador por defecto
        controller = require('../../centralAccess/dataFetcher');
    }

    /**
     * Obtiene todos los registros de solicitudes de usuario.
     * 
     * @async
     * @function
     * @param {string} username - El nombre de usuario para autenticación.
     * @param {string} password - La contraseña para autenticación.
     * @returns {Promise<Object>} - Una promesa que devuelve los datos de las solicitudes de usuario.
     */
    async function getAll(username, password) {
        const key = 'SELECT UserRequest';  // Consulta SQL para obtener las solicitudes de usuario
        return controller.getAll(request, key, username, password);  // Llamada al controlador para obtener los datos
    }

    return {
        getAll,
    };
}
