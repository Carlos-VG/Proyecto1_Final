const request = 'UserRequest';

/**
 * Módulo para gestionar las solicitudes de usuario.
 * 
 * @module userRequestController
 * 
 * @param {Object} centralAccessInjected - El controlador de acceso central inyectado.
 * Si no se proporciona, se utiliza el controlador por defecto.
 * @returns {Object} El controlador que gestiona las solicitudes de usuario.
 */
module.exports = function (centralAccessInjected) {
    let controller = centralAccessInjected;

    if (!controller) {
        controller = require('../../centralAccess/dataFetcher');
    }

    /**
     * Obtiene todas las solicitudes de usuario desde el acceso central.
     * 
     * @async
     * @function getAll
     * @param {string} username - El nombre de usuario para autenticar la solicitud.
     * @param {string} password - La contraseña del usuario para autenticar la solicitud.
     * @returns {Promise<Object>} Los datos de las solicitudes de usuario.
     */
    async function getAll(username, password) {
        const key = 'SELECT UserRequest WHERE 1';
        return controller.getAll(request, key, username, password);
    }

    return {
        getAll
    };
}
