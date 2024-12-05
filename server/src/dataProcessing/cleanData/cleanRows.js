const { spawn } = require('child_process');

/**
 * Limpia los datos eliminando solo las columnas necesarias y opcionalmente procesa los datos con un script de Python.
 * @async
 * @function cleanData
 * @param {Object} data - Los datos a limpiar, que contienen objetos con campos a filtrar.
 * @param {Array<string>} columns - Las columnas que deben mantenerse en los objetos de datos.
 * @param {boolean} [usePython=false] - Si es verdadero, se ejecuta un script de Python para procesar los datos.
 * @param {string} [pythonScriptPath=''] - La ruta al script de Python que se debe ejecutar (si usePython es verdadero).
 * @param {Array} [filters=[]] - Filtros opcionales que se pasarán al script de Python (si usePython es verdadero).
 * @returns {Promise<Object[]>} Los datos procesados, limpios y, si es necesario, filtrados por Python.
 * @throws {Error} Lanza un error si algo falla al procesar los datos o ejecutar el script de Python.
 */
async function cleanData(data, columns, usePython = false, pythonScriptPath = '', filters = []) {
    try {
        const cleanedDataArray = [];

        // Itera sobre cada objeto en los resultados
        for (const key in data.objects) {
            const fields = data.objects[key].fields;

            // Crea un nuevo objeto para cada registro con solo los campos requeridos
            const cleanedData = {};

            // Filtra los campos en función de la lista de columnas proporcionada
            columns.forEach(column => {
                if (fields.hasOwnProperty(column)) {
                    cleanedData[column] = fields[column];
                }
            });

            cleanedDataArray.push(cleanedData);
        }

        // Ejecuta el script de Python si se necesita
        if (usePython && pythonScriptPath) {
            try {
                // Si no se proporcionan filtros, se pasa un arreglo vacío
                return await runPythonScript(cleanedDataArray, pythonScriptPath, filters || []);
            } catch (error) {
                console.error('Error al ejecutar el script de Python:', error);
                throw new Error('Error al procesar datos con Python');
            }
        } else {
            return cleanedDataArray; // Devuelve los datos limpios
        }
    } catch (error) {
        console.error('Error en la función de limpieza de datos:', error);
        throw new Error('Error en la función de limpieza de datos');
    }
}

/**
 * Ejecuta un script de Python para procesar los datos y retornar el resultado.
 * @function runPythonScript
 * @param {Object[]} data - Los datos a procesar por el script de Python.
 * @param {string} pythonScriptPath - La ruta al script de Python.
 * @param {Array} filters - Filtros opcionales a pasar al script de Python.
 * @returns {Promise<Object>} Los datos procesados por el script de Python.
 * @throws {Error} Lanza un error si el script de Python falla o la salida no es un JSON válido.
 */
function runPythonScript(data, pythonScriptPath, filters) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [pythonScriptPath]);

        // Prepara los datos con filtros opcionales
        const payload = {
            data,
            filters: filters.length ? filters : []  // Asegura que los filtros sean un arreglo vacío si no se proporcionan
        };

        pythonProcess.stdin.write(JSON.stringify(payload));
        pythonProcess.stdin.end();

        let result = '';
        let errorLog = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorLog += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                try {
                    resolve(JSON.parse(result));
                } catch (error) {
                    reject(new Error(`Error al parsear JSON de Python: ${error.message}\nSalida de Python: ${result}`));
                }
            } else {
                reject(new Error(`Python terminó con código ${code}. Log de error:\n${errorLog}`));
            }
        });
    });
}

/**
 * Exporta la función de limpieza de datos.
 * @module dataCleaning
 */
module.exports = cleanData;
