const request = 'UserRequest';

module.exports = function (centralAccessInjected) {
    let controller = centralAccessInjected;

    if (!controller) {
        controller = require('../../centralAccess/dataFetcher');
    }

    async function getAll() {
        key = 'SELECT UserRequest WHERE team_id = 48414 AND (operational_status = "resolved" OR operational_status = "closed")';
        return controller.getAll(request, key);
    }

    return {
        getAll,
    };
}