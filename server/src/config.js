require('dotenv').config();

/**
 * @file config.js
 * @brief Configuración de la aplicación y carga de variables de entorno
 * 
 * Este archivo carga las variables de entorno desde un archivo `.env` y configura
 * los parámetros clave de la aplicación, como el puerto de la aplicación, la URL de acceso central,
 * la versión de iTop y el secreto JWT para la autenticación.
 */

module.exports = {
    /**
     * @brief Configuración de la aplicación
     * 
     * Incluye el puerto en el que la aplicación escuchará las solicitudes.
     * La variable de entorno `PORT` debe estar definida en el archivo `.env`.
     */
    app: {
        port: process.env.PORT
    },

    /**
     * @brief Configuración de acceso central
     * 
     * Contiene la URL para acceder a los servicios centrales y la versión de iTop.
     * Las variables `CENTRAL_ACCESS_URL` y `ITOP_VERSION` deben estar definidas en el archivo `.env`.
     */
    centralAccess: {
        url: process.env.CENTRAL_ACCESS_URL,
        itopversion: process.env.ITOP_VERSION,
    },

    /**
     * @brief Configuración del JSON Web Token (JWT)
     * 
     * Contiene el secreto utilizado para firmar y verificar los JWT.
     * La variable `JWT_SECRET` debe estar definida en el archivo `.env`.
     */
    jwt: {
        secret: process.env.JWT_SECRET
    }
}
