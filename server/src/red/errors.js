/**
 * Middleware para manejar errores en la aplicación.
 * 
 * Este middleware captura los errores que ocurren durante la ejecución de la aplicación, 
 * los registra en la consola y responde con un mensaje de error al cliente.
 * 
 * @param {Object} err - El objeto de error que contiene información sobre el error ocurrido.
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función que pasa el control al siguiente middleware.
 * @returns {void} - No devuelve nada, solo maneja el error y envía la respuesta.
 */
function errors(err, req, res, next) {
    // Registra el error en la consola.
    console.error('[error]', err);

    // Obtiene el mensaje de error, o usa un mensaje por defecto.
    const message = err.message || 'Error interno';

    // Obtiene el código de estado, o usa 500 por defecto si no está especificado.
    const status = err.statusCode || 500;

    // Utiliza el módulo `respuesta` para enviar el error al cliente.
    respuesta.error(req, res, message, status);
}

module.exports = errors;
