const express = require('express');
const answers = require('../../red/answers');
const controller = require('./index');
const cleanData = require('../../dataProcessing/cleanData/cleanRows');
const path = require('path');
const security = require('../../middleware/security');
const router = express.Router();

// Definición de las columnas deseadas para limpiar los datos
const desiredColumns = [
    'ref',
    'priority',
    'impact',
    'origin',
    'urgency',
    'request_type',
    'time_spent',
    'org_name',
    'service_name',
    'operational_status',
];

// Filtros que se aplicarán a los datos antes de procesarlos
const filters = [
    'org_name',
    'service_name',
    'operational_status',
];

// Ruta al script de Python que se usará para procesar los datos
const pythonScriptPath = path.join(__dirname, '../../dataProcessing/scripts/script1.py');

/**
 * Define las rutas de la API relacionadas con la obtención de solicitudes de usuario.
 * 
 * @module userRequestRouter
 */

/**
 * Ruta para manejar las solicitudes POST y obtener todos los datos de usuario.
 * Esta ruta utiliza el middleware de seguridad para verificar la autenticación 
 * antes de obtener y limpiar los datos.
 * 
 * @function
 * @route {POST} /
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @param {Function} next - La función para pasar el control al siguiente middleware.
 */
router.post('/', security(), getAll);

/**
 * Controlador que maneja la obtención de los datos de usuario, la limpieza de los datos
 * y el retorno de la respuesta con los datos procesados.
 * 
 * @async
 * @function getAll
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @param {Function} next - La función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Responde con los datos procesados o un error en caso de fallo.
 */
async function getAll(req, res, next) {
    try {
        // Obtiene los elementos del controlador
        const items = await controller.getAll(req.user.username, req.user.password);

        // Limpia los datos y ejecuta el script de Python si es necesario
        const cleanedData = await cleanData(items, desiredColumns, true, pythonScriptPath, filters);

        // Responde con los datos procesados
        answers.success(req, res, cleanedData, 200);
    } catch (error) {
        // Responde con un error si algo falla
        answers.error(req, res, 'error', 500);
        next(error);
    }
}

module.exports = router;
