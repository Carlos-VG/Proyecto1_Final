const path = require('path');
const cleanData = require('../../dataProcessing/cleanData/cleanRows');

const request = 'UserRequest';

const desiredColumns = [
    'service_name',
    'servicesubcategory_name',
    'time_spent',
    'start_date',
    'last_update',
    'close_date',
    'assignment_date',
    'resolution_date'
];

const pythonScriptPath = path.join(__dirname, '../../dataProcessing/scripts/script3.py');

module.exports = function (centralAccessInjected) {
    let controller = centralAccessInjected;

    if (!controller) {
        controller = require('../../centralAccess/dataFetcher');
    }

    async function getAll() {
        key = 'SELECT UserRequest WHERE team_id = 48414 AND (operational_status = "resolved" OR operational_status = "closed")';
        return cleanData(await controller.getAll(request, key), desiredColumns, true, pythonScriptPath);
        // return cleanData(await controller.getAll(request, key), desiredColumns);
    }

    return {
        getAll,
    };
}