const request = 'UserRequest';

/**
 * Módulo que maneja la obtención de solicitudes de usuario filtradas por estado de resolución.
 * 
 * @module UserRequestModule
 * @param {Object} centralAccessInjected - Controlador inyectado para acceder a datos. Si no se proporciona, se utiliza el controlador predeterminado.
 * @returns {Object} Un objeto con la función `getAll` para obtener solicitudes de usuario.
 */
module.exports = function (centralAccessInjected) {
    let controller = centralAccessInjected;

    // Si no se inyecta un controlador, se utiliza el controlador predeterminado.
    if (!controller) {
        controller = require('../../centralAccess/dataFetcher');
    }

    /**
     * Obtiene todas las solicitudes de usuario filtradas por el estado de resolución.
     * 
     * @async
     * @function
     * @param {string} username - El nombre de usuario para autenticar la solicitud.
     * @param {string} password - La contraseña del usuario para autenticar la solicitud.
     * @returns {Promise<Object>} Un objeto con las solicitudes de usuario que cumplen con el filtro.
     * @throws {Error} Si ocurre un error al obtener los datos.
     */
    async function getAll(username, password) {
        // Consulta para obtener solicitudes de usuario con un estado "resuelto" o "cerrado".
        const key = 'SELECT UserRequest WHERE operational_status = "resolved" OR operational_status = "closed"';
        return controller.getAll(request, key, username, password);
    }

    // Retorna el objeto con la función `getAll`.
    return {
        getAll,
    };
}
