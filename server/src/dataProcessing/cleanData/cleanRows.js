const { spawn } = require('child_process');

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

module.exports = cleanData;
