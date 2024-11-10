const { spawn } = require('child_process');

async function cleanData(data, columns, usePython = false, pythonScriptPath = '') {
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
                return await runPythonScript(cleanedDataArray, pythonScriptPath);
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

function runPythonScript(data, pythonScriptPath) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [pythonScriptPath]);

        // Enviar los datos JSON al script de Python
        pythonProcess.stdin.write(JSON.stringify(data));
        pythonProcess.stdin.end();

        let result = '';
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                resolve(JSON.parse(result));
            } else {
                reject(new Error(`El proceso de Python finalizó con código ${code}`));
            }
        });
    });
}

module.exports = cleanData;
