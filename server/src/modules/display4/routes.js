const express = require('express');
const answers = require('../../red/answers');
const controller = require('./index');
const router = express.Router();
const cleanData = require('../../dataProcessing/cleanData/cleanRows');
const security = require('../../middleware/security');
const path = require('path');

// Columnas deseadas para procesar los datos.
const desiredColumns = [
    'ref',
    'org_id',
    'org_name',
    'time_spent',
    'service_name',
    'operational_status'
];

// Filtros que se aplicarán a las solicitudes.
const filters = [
    'service_name',
    'operational_status'
];

// Ruta del script de Python que se usará para procesar los datos.
const pythonScriptPath = path.join(__dirname, '../../dataProcessing/scripts/script4.py');

/**
 * Configura las rutas y el middleware para la gestión de solicitudes relacionadas con los datos de usuario.
 * 
 * @module UserRequestDataRouter
 * @returns {Object} El objeto router con la ruta configurada.
 */
router.post('/', security(), getAll);

/**
 * Controlador para obtener todos los elementos relacionados con solicitudes de usuario y limpiar los datos.
 * 
 * @async
 * @function
 * @param {Object} req - El objeto de solicitud de Express, que contiene los parámetros del usuario.
 * @param {Object} res - El objeto de respuesta de Express, que se utiliza para devolver los resultados.
 * @param {Function} next - Función de devolución de llamada para pasar el control a la siguiente función de middleware.
 * @throws {Error} Si ocurre un error al obtener o limpiar los datos.
 */
async function getAll(req, res, next) {
    try {
        // Obtiene las solicitudes de usuario utilizando el controlador.
        const items = await controller.getAll(req.user.username, req.user.password);
        
        // Limpia los datos usando la función cleanData.
        const cleanedData = await cleanData(items, desiredColumns, true, pythonScriptPath, filters);
        
        // Devuelve los datos limpios en formato JSON.
        answers.success(req, res, cleanedData, 200);
    } catch (error) {
        // Maneja el error si ocurre algún problema durante el proceso.
        answers.error(req, res, 'error', 500);
        next(error);
    }
}

module.exports = router;
