const request = 'UserRequest';

module.exports = function (centralAccessInjected) {
    let controller = centralAccessInjected;

    if (!controller) {
        controller = require('../../centralAccess/dataFetcher');
    }

    async function getAll() {
        const key = 'SELECT UserRequest WHERE service_id IN (10, 13, 29, 34, 21, 22, 23, 24, 25, 26)'
        return controller.getAll(request, key);
    }

    return {
        getAll,
    };
}