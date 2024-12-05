const auth = require('../../auth');

/**
 * Middleware que verifica la autenticidad del token de autorización en la solicitud.
 * Este middleware utiliza el método `confirmarToken` de la capa de autenticación para verificar el token.
 * Si el token es válido, permite que la solicitud continúe, de lo contrario, lanza un error.
 * 
 * @function chequearAuth
 * @returns {Function} La función middleware que se usa como middleware en las rutas.
 */
module.exports = function chequearAuth() {
    /**
     * Middleware que verifica el token de autorización en la solicitud.
     * 
     * @param {Object} req - El objeto de la solicitud, que contiene la cabecera de autorización.
     * @param {Object} res - El objeto de respuesta, que no se utiliza en este middleware.
     * @param {Function} next - La función que pasa el control al siguiente middleware o ruta si el token es válido.
     */
    function middleware(req, res, next) {
        auth.chequearToken.confirmarToken(req);
        next();
    }

    return middleware;
}
