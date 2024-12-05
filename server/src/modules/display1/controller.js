const request = 'UserRequest';

/**
 * Módulo que obtiene información sobre las solicitudes de usuarios desde el acceso central.
 * 
 * Este módulo define una función que se encarga de consultar las solicitudes de usuarios 
 * que tienen un estado operativo "resuelto" o "cerrado". Si no se proporciona un controlador, 
 * se utiliza un controlador predeterminado para obtener los datos.
 * 
 * @module userRequestController
 * @param {Object} centralAccessInjected - El controlador de acceso central que se inyecta en el módulo.
 * Si no se proporciona, se utiliza uno predeterminado.
 * @returns {Object} El módulo con la función `getAll` para obtener las solicitudes de usuarios.
 */
module.exports = function (centralAccessInjected) {
    let controller = centralAccessInjected;

    // Si no se proporciona un controlador, usa el controlador predeterminado
    if (!controller) {
        controller = require('../../centralAccess/dataFetcher');
    }

    /**
     * Obtiene todas las solicitudes de usuarios con un estado operativo de "resuelto" o "cerrado".
     * 
     * La función construye una clave para filtrar las solicitudes de usuarios con esos estados específicos 
     * y llama al controlador para obtener la información desde la fuente central de datos.
     * 
     * @async
     * @function getAll
     * @param {string} username - El nombre de usuario para la autenticación.
     * @param {string} password - La contraseña para la autenticación.
     * @returns {Promise<Object>} Una promesa que resuelve la respuesta con las solicitudes de usuarios.
     */
    async function getAll(username, password) {
        const key = 'SELECT UserRequest WHERE operational_status = "resolved" OR operational_status = "closed"';
        return controller.getAll(request, key, username, password);
    }

    return {
        getAll,
    };
}
