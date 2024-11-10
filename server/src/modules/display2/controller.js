const cleanData = require('../../dataProcessing/cleanData/cleanRows');
const path = require('path');
const request = 'UserRequest';

const desiredColumns = [
    'ref',
    'operational_status'
];

const pythonScriptPath = path.join(__dirname, '../../dataProcessing/scripts/script2.py');

module.exports = function (centralAccessInjected) {
    let controller = centralAccessInjected;

    if (!controller) {
        controller = require('../../centralAccess/dataFetcher');
    }

    // Consulta para casos con estado 'resolved' o 'closed'
    async function getAllResolvedOrClosedCases() {
        const key = 'SELECT UserRequest WHERE operational_status = "resolved" OR operational_status = "closed"';
        return cleanData(await controller.getAll(request, key), desiredColumns, true, pythonScriptPath);
    }

    // Consulta para todos los casos reportados
    async function getAllReportedCases() {
        const key = 'SELECT UserRequest WHERE 1';
        return cleanData(await controller.getAll(request, key), desiredColumns, true, pythonScriptPath);
    }

    return {
        getAllResolvedOrClosedCases,
        getAllReportedCases,
    };
}
