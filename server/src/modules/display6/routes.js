const express = require('express');
const answers = require('../../red/answers');
const controller = require('./index');
const router = express.Router();
const cleanData = require('../../dataProcessing/cleanData/cleanRows');
const security = require('../../middleware/security');
const path = require('path');

// Columnas deseadas que se incluirán en la respuesta.
const desiredColumns = [
    'ref',
    'status',
    'service_id',
    'service_name',
    'org_id',
    'org_name',
    'time_spent',
];

// Filtros que se aplicarán para procesar los datos.
const filters = [
    'service_name',
    'org_name',
];

// Ruta del script de Python utilizado para procesar los datos.
const pythonScriptPath = path.join(__dirname, '../../dataProcessing/scripts/script6.py');

/**
 * Ruta POST para obtener los datos procesados.
 * 
 * @route POST /path/to/endpoint
 * @param {string} username - Nombre de usuario para autenticación.
 * @param {string} password - Contraseña para autenticación.
 * @returns {Object} - Devuelve los datos procesados con las columnas deseadas y los filtros aplicados.
 */
router.post('/', security(), getAll);

/**
 * Función que obtiene los datos de las solicitudes de usuario y los procesa.
 * 
 * @async
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función `next` para pasar al siguiente middleware si ocurre un error.
 * @returns {Promise<void>} - Devuelve una promesa que resuelve la respuesta HTTP.
 */
async function getAll(req, res, next) {
    try {
        // Obtención de los datos de las solicitudes de usuario desde el controlador.
        const items = await controller.getAll(req.user.username, req.user.password);
        
        // Limpieza y filtrado de los datos usando el script de Python.
        const cleanedData = await cleanData(items, desiredColumns, true, pythonScriptPath, filters);
        
        // Respuesta exitosa con los datos procesados.
        answers.success(req, res, cleanedData, 200);
    } catch (error) {
        // En caso de error, se responde con un mensaje de error.
        answers.error(req, res, 'error', 500);
        next(error);
    }
}

module.exports = router;
