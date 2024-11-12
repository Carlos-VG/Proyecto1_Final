const cleanData = require('../../dataProcessing/cleanData/cleanRows');
const path = require('path');

const request = 'UserRequest';

const desiredColumns = [
    'ref',
    'operational_status',
    'agent_id',
    'agent_id_friendlyname',
    'team_id',
    'team_id_friendlyname',
    'time_spent',
];

const pythonScriptPath = path.join(__dirname, '../../dataProcessing/scripts/script6.py');

module.exports = function (centralAccessInjected) {
    let controller = centralAccessInjected;

    if (!controller) {
        controller = require('../../centralAccess/dataFetcher');
    }

    async function getAll() {
       const key = 'SELECT UserRequest WHERE service_id IN (10, 13, 29, 34, 21, 22, 23, 24, 25, 26)'
        return cleanData(await controller.getAll(request, key), desiredColumns, true, pythonScriptPath);
    }

    return {
        getAll,
    };
}