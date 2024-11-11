const cleanData = require('../../dataProcessing/cleanData/cleanRows');
const path = require('path');

const request = 'UserRequest';

const desiredColumns = [
    'ref',
    'org_id',
    'org_name',
    'time_spent',
];

const pythonScriptPath = path.join(__dirname, '../../dataProcessing/scripts/script4.py');

module.exports = function (centralAccessInjected) {
    let controller = centralAccessInjected;

    if (!controller) {
        controller = require('../../centralAccess/dataFetcher');
    }

    async function getAll() {
        key = 'SELECT UserRequest WHERE operational_status = "resolved" OR operational_status = "closed"';
        return cleanData(await controller.getAll(request, key), desiredColumns, true, pythonScriptPath);
    }

    return {
        getAll,
    };
}