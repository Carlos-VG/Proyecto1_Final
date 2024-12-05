const app = require('./app');

/**
 * Inicia el servidor y lo configura para escuchar en el puerto especificado.
 * El puerto se obtiene de la configuración de la aplicación.
 * @listens {number} Puerto en el que el servidor está escuchando.
 */
app.listen(app.get('port'), () => {
    console.log("Servidor escuchando en el puerto", app.get('port'));
});
