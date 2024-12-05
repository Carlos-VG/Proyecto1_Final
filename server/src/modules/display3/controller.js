const request = 'UserRequest';

/**
 * Módulo que gestiona la obtención de solicitudes de usuario desde un servicio central.
 * 
 * @module UserRequestHandler
 */

/**
 * Función principal del módulo, que permite inyectar un controlador o usar uno por defecto.
 * 
 * @param {Object} centralAccessInjected - El controlador inyectado, que se usa para obtener datos.
 * @returns {Object} El objeto que contiene la función `getAll` para obtener solicitudes de usuario.
 */
module.exports = function (centralAccessInjected) {
    let controller = centralAccessInjected;

    // Si no se proporciona un controlador inyectado, se usa uno por defecto
    if (!controller) {
        controller = require('../../centralAccess/dataFetcher');
    }

    /**
     * Obtiene todas las solicitudes de usuario que cumplen con el filtro especificado.
     * 
     * @async
     * @function
     * @param {string} username - El nombre de usuario para autenticar la solicitud.
     * @param {string} password - La contraseña para autenticar la solicitud.
     * @returns {Promise<Object>} Los datos de las solicitudes de usuario que cumplen con el filtro.
     * @throws {Error} Si ocurre un error al obtener los datos desde el controlador.
     */
    async function getAll(username, password) {
        // Define la consulta para obtener las solicitudes con un `team_id` específico y estados operacionales "resolved" o "closed"
        const key = 'SELECT UserRequest WHERE team_id = 48414 AND (operational_status = "resolved" OR operational_status = "closed")';
        return controller.getAll(request, key, username, password);
    }

    return {
        getAll,
    };
}
