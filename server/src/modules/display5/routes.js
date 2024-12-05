const express = require('express');
const answers = require('../../red/answers');
const controller = require('./index');
const router = express.Router();
const cleanData = require('../../dataProcessing/cleanData/cleanRows');
const security = require('../../middleware/security');
const path = require('path');

// Columnas deseadas para el procesamiento de datos
const desiredColumns = [
    'ref',
    'operational_status',
    'agent_id',
    'agent_id_friendlyname',
    'team_id',
    'team_id_friendlyname',
    'time_spent',
];

// Ruta al script de Python para procesar los datos
const pythonScriptPath = path.join(__dirname, '../../dataProcessing/scripts/script5.py');

/**
 * Ruta POST para obtener y procesar los datos de las solicitudes de usuario.
 * 
 * @function
 * @name getAll
 * @async
 * @param {Object} req - El objeto de solicitud que contiene las credenciales del usuario.
 * @param {Object} res - El objeto de respuesta para enviar los datos procesados.
 * @param {Function} next - El siguiente middleware en la cadena.
 */
router.post('/', security(), getAll);

/**
 * Función para obtener todos los datos de las solicitudes de usuario y procesarlos.
 * 
 * @async
 * @function
 * @param {Object} req - El objeto de solicitud que contiene las credenciales del usuario.
 * @param {Object} res - El objeto de respuesta para enviar los datos procesados.
 * @param {Function} next - El siguiente middleware en la cadena.
 * @throws {Error} Si ocurre un error al obtener o procesar los datos.
 */
async function getAll(req, res, next) {
    try {
        // Obtener los datos de las solicitudes de usuario
        const items = await controller.getAll(req.user.username, req.user.password);
        
        // Limpiar y procesar los datos obtenidos
        const cleanedData = await cleanData(items, desiredColumns, true, pythonScriptPath);
        
        // Enviar los datos procesados como respuesta
        answers.success(req, res, cleanedData, 200);
    } catch (error) {
        // Manejar errores y enviar respuesta de error
        answers.error(req, res, 'error', 500);
        next(error);
    }
}

module.exports = router;
