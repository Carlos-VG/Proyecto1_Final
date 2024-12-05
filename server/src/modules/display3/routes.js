const express = require('express');
const path = require('path');
const answers = require('../../red/answers');
const controller = require('./index');
const cleanData = require('../../dataProcessing/cleanData/cleanRows');
const security = require('../../middleware/security');
const router = express.Router();

/**
 * Columnas deseadas para filtrar los datos.
 * @const {Array<string>} desiredColumns - Las columnas que se desean conservar de los datos.
 */
const desiredColumns = [
    'service_name',
    'servicesubcategory_name',
    'time_spent',
    'start_date',
    'last_update',
    'close_date',
    'assignment_date',
    'resolution_date'
];

/**
 * Ruta del script de Python utilizado para procesar los datos.
 * @const {string} pythonScriptPath - La ruta al script de Python que se ejecutará.
 */
const pythonScriptPath = path.join(__dirname, '../../dataProcessing/scripts/script3.py');

/**
 * Configura la ruta POST para obtener datos filtrados y procesados.
 * @function
 */
router.post('/', security(), getAll);

/**
 * Obtiene los datos filtrados y procesados, luego responde con los datos limpios.
 * 
 * @async
 * @function
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 * @param {Function} next - El siguiente middleware en la cadena.
 * @returns {Promise<void>} Responde con los datos limpios.
 * @throws {Error} Si ocurre un error al obtener o procesar los datos.
 */
async function getAll(req, res, next) {
    try {
        // Obtiene los datos a partir de las credenciales del usuario
        const items = await controller.getAll(req.user.username, req.user.password);

        // Limpia los datos y aplica el script de Python para el procesamiento
        const cleanedData = await cleanData(items, desiredColumns, true, pythonScriptPath);

        // Responde con los datos procesados
        answers.success(req, res, cleanedData, 200);
    } catch (error) {
        // Maneja cualquier error y responde con un error 500
        answers.error(req, res, 'error', 500);
        next(error);
    }
}

module.exports = router;
