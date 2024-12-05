const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const error = require('./red/errors');

const config = require('./config');
const auth = require('./modules/auth/routes');
const display1 = require('./modules/display1/routes');
const display2 = require('./modules/display2/routes');
const display3 = require('./modules/display3/routes');
const display4 = require('./modules/display4/routes');
const display5 = require('./modules/display5/routes');
const display6 = require('./modules/display6/routes');

const app = express();

/**
 * @brief Middleware para el manejo de JSON, registros de solicitudes y configuración de CORS
 * 
 * Este archivo configura la aplicación Express, incluyendo el manejo de solicitudes 
 * HTTP, la configuración de CORS para permitir peticiones desde un dominio específico,
 * y la gestión de errores mediante middleware.
 */
 
/**
 * @brief Middleware para registrar las solicitudes HTTP.
 * 
 * Usa `morgan` para registrar las solicitudes entrantes y sus respuestas en el formato 'dev'.
 */
app.use(morgan('dev'));

/**
 * @brief Configuración de CORS para permitir solicitudes desde el dominio especificado.
 * 
 * Establece las cabeceras CORS para permitir solicitudes desde 'http://localhost:5173'.
 */
app.use(cors({
    origin: 'http://localhost:5173'
}));

/**
 * @brief Middleware para manejar el cuerpo de las solicitudes HTTP.
 * 
 * Se utiliza para analizar los cuerpos de las solicitudes en formato JSON y URL-encoded.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * @brief Middleware para permitir solicitudes CORS adicionales.
 * 
 * Se agrega una configuración CORS más amplia a la aplicación.
 */
app.use(cors());

/**
 * @brief Establece el puerto de la aplicación a partir de la configuración.
 * 
 * Usa el valor definido en `config.app.port` para configurar el puerto en el que la aplicación escucha.
 */
app.set('port', config.app.port);

/**
 * @brief Definición de las rutas de la API.
 * 
 * Se configuran las rutas para los módulos de autenticación y visualización.
 * Estas rutas gestionan las solicitudes de los diferentes recursos de la aplicación.
 */
app.use('/api/auth/', auth);
app.use('/api/display1', display1);
app.use('/api/display2', display2);
app.use('/api/display3', display3);
app.use('/api/display4', display4);
app.use('/api/display5', display5);
app.use('/api/display6', display6);

/**
 * @brief Middleware para manejar los errores.
 * 
 * Cualquier error que ocurra en la aplicación será procesado por este middleware, 
 * y se enviará una respuesta de error al cliente.
 */
app.use(error);

module.exports = app;
