/**
 * Responde con un mensaje de éxito.
 * 
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {string} [mensaje=''] - El mensaje a enviar en el cuerpo de la respuesta.
 * @param {number} [status=200] - El código de estado HTTP que se enviará en la respuesta.
 * @returns {void} - No devuelve nada, solo envía la respuesta.
 */
exports.success = function (req, res, mensaje = '', status = 200) {
    res.status(status).send({
        error: false,
        status: status,
        body: mensaje,
    });
}

/**
 * Responde con un mensaje de error.
 * 
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {string} [mensaje=''] - El mensaje de error a enviar en el cuerpo de la respuesta.
 * @param {number} [status=500] - El código de estado HTTP que se enviará en la respuesta.
 * @returns {void} - No devuelve nada, solo envía la respuesta.
 */
exports.error = function (req, res, mensaje = '', status = 500) {
    res.status(status).send({
        error: true,
        status: status,
        body: mensaje,
    });
}
