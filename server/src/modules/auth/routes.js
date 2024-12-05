const express = require('express');
const answers = require('../../red/answers');
const controller = require('./index');
const router = express.Router();

/**
 * Ruta para autenticar a un usuario mediante su nombre de usuario y contraseña.
 * 
 * Este módulo define una ruta `POST` que permite autenticar a un usuario. 
 * Si las credenciales son correctas, se genera un token de autenticación. 
 * Si las credenciales son incorrectas, se devuelve un error de autenticación.
 * 
 * @module loginRouter
 */

/**
 * Middleware que maneja el proceso de inicio de sesión de un usuario.
 * Recibe el nombre de usuario y la contraseña desde el cuerpo de la solicitud, 
 * llama al controlador de inicio de sesión y responde con un token si la autenticación es exitosa.
 * Si ocurre un error durante el proceso de autenticación, se responde con el error adecuado.
 * 
 * @async
 * @function login
 * @param {Object} req - La solicitud HTTP que contiene el nombre de usuario y la contraseña en el cuerpo.
 * @param {Object} res - La respuesta HTTP que se envía con el token o el error.
 * @param {Function} next - La función para pasar el control al siguiente middleware si es necesario.
 * @returns {void} No devuelve un valor, pero envía una respuesta HTTP con el resultado de la autenticación.
 */
router.post('/', login);

async function login(req, res, next) {
    try {
        // Llama al controlador para autenticar al usuario
        const token = await controller.login(req.body.username, req.body.password);

        // Devuelve un token exitoso si la autenticación es correcta
        answers.success(req, res, token, 200);
    } catch (error) {
        // Maneja el error si las credenciales son incorrectas
        if (error.message.includes('Credenciales incorrectas')) {
            answers.error(req, res, 'Credenciales incorrectas', 401);
        } else {
            // Maneja cualquier otro error de autenticación
            answers.error(req, res, 'Error al autenticar el usuario', 500);
        }
        next(error);
    }
}

module.exports = router;
