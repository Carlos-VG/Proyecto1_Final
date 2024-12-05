const request = 'UserRequest';

/**
 * Módulo para acceder a la información de solicitudes de usuario.
 * 
 * @module UserRequestDataFetcher
 * @param {Object} centralAccessInjected - Objeto controlador que maneja el acceso central a los datos (opcionalmente inyectado).
 * @returns {Object} El objeto que contiene la función `getAll` para obtener las solicitudes de usuario.
 */
module.exports = function (centralAccessInjected) {
    let controller = centralAccessInjected;

    // Si no se inyecta un controlador, usa el controlador por defecto.
    if (!controller) {
        controller = require('../../centralAccess/dataFetcher');
    }

    /**
     * Obtiene todas las solicitudes de usuario con un estado "resuelto" o "cerrado".
     * 
     * @async
     * @function
     * @param {string} username - El nombre de usuario para autenticar la solicitud.
     * @param {string} password - La contraseña asociada al nombre de usuario.
     * @returns {Promise<Object>} Una promesa que resuelve con los datos de las solicitudes de usuario.
     * @throws {Error} Si ocurre un error al obtener las solicitudes de usuario.
     */
    async function getAll(username, password) {
        const key = 'SELECT UserRequest WHERE operational_status = "resolved" OR operational_status = "closed"';
        return controller.getAll(request, key, username, password);
    }

    // Retorna la función `getAll` para que se pueda usar desde otros módulos.
    return {
        getAll,
    };
}
