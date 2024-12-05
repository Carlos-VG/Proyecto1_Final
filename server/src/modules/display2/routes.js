const express = require('express');
const answers = require('../../red/answers');
const controller = require('./index');
const router = express.Router();
const cleanData = require('../../dataProcessing/cleanData/cleanRows');
const security = require('../../middleware/security');
const path = require('path');

// Columnas deseadas para la limpieza de datos
const desiredColumns = [
    'ref',
    'operational_status',
    'org_name',
    'service_name',
    'priority',
    'impact',
    'urgency',
    'request_type',
];

// Filtros aplicables a los datos
const filters = [
    'org_name',
    'service_name',
    'priority',
    'impact',
    'urgency',
    'request_type',
];

// Ruta del script de Python que procesará los datos
const pythonScriptPath = path.join(__dirname, '../../dataProcessing/scripts/script2.py');

/**
 * Ruta para obtener los datos procesados.
 * 
 * @function
 * @name getAll
 * @param {Object} req - El objeto de solicitud Express.
 * @param {Object} res - El objeto de respuesta Express.
 * @param {Function} next - La función `next` para pasar el control.
 * @returns {Promise<void>}
 */
router.post('/', security(), getAll);

/**
 * Obtiene los datos procesados de las solicitudes de usuario, limpia los datos
 * según las columnas deseadas y los filtros, y luego los devuelve en formato JSON.
 * 
 * @async
 * @function
 * @param {Object} req - El objeto de solicitud Express.
 * @param {Object} res - El objeto de respuesta Express.
 * @param {Function} next - La función `next` para pasar el control en caso de error.
 * @throws {Error} Si ocurre un error al procesar los datos o en la ejecución del script de Python.
 */
async function getAll(req, res, next) {
    try {
        // Obtiene los elementos desde el controlador
        const items = await controller.getAll(req.user.username, req.user.password);
        
        // Limpia los datos según las columnas deseadas y los filtros
        const cleanedData = await cleanData(items, desiredColumns, true, pythonScriptPath, filters);
        
        // Devuelve los datos procesados con éxito
        answers.success(req, res, cleanedData, 200);
    } catch (error) {
        // Devuelve un error si algo falla
        answers.error(req, res, 'error', 500);
        next(error);
    }
}

module.exports = router;
