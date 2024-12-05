const centralAccess = require('../../centralAccess/dataFetcher');
const ctrl = require('./controller');

/**
 * Módulo que inicializa el controlador con el acceso central.
 * Este módulo importa el acceso central (`dataFetcher`) y el controlador (`controller`),
 * luego los combina para crear un controlador que utiliza el acceso a los datos.
 * 
 * @module centralAccessController
 * @returns {Object} El controlador que gestiona la lógica de acceso a los datos.
 */
module.exports = ctrl(centralAccess);
