const request = 'UserRequest';
const auth = require('../../../auth');

/**
 * Módulo de autenticación para gestionar el inicio de sesión de un usuario.
 * Este módulo permite autenticar a un usuario mediante su nombre de usuario y contraseña.
 * Si las credenciales son correctas, se genera un token de autenticación.
 * 
 * @param {Object} centralAccessInjected - Un objeto de acceso central inyectado que contiene el controlador para la obtención de datos (opcional).
 * Si no se inyecta, se utiliza el controlador por defecto.
 * 
 * @returns {Object} Un objeto que contiene el método `login` para autenticar a un usuario.
 */
module.exports = function (centralAccessInjected) {
    let controller = centralAccessInjected;

    if (!controller) {
        controller = require('../../centralAccess/dataFetcher');
    }

    /**
     * Inicia sesión de un usuario utilizando su nombre de usuario y contraseña.
     * Si las credenciales son válidas, se genera un token de autenticación.
     * Si las credenciales son incorrectas, se lanza un error.
     * 
     * @async
     * @param {string} username - El nombre de usuario para la autenticación.
     * @param {string} password - La contraseña del usuario.
     * 
     * @throws {Error} Si las credenciales son incorrectas.
     * @returns {Promise<string>} Un token de autenticación generado si las credenciales son correctas.
     */
    async function login(username, password) {
        try {
            const key = 'SELECT Organization';

            const data = await controller.getAll(request, key, username, password);

            if (!data || !data.objects || Object.keys(data.objects).length === 0) {
                throw new Error('Credenciales incorrectas');
            }
            const payload = {
                username: username,
                password: password,
            };
            const token = auth.asignarToken(payload);

            return token;

        } catch (error) {
            throw new Error('Credenciales incorrectas');
        }
    }

    return {
        login,
    };
}
