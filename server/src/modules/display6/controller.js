const request = 'UserRequest';

module.exports = function (centralAccessInjected) {
    let controller = centralAccessInjected;

    if (!controller) {
        controller = require('../../centralAccess/dataFetcher');
    }

    async function getAll(username, password) {
        const key = 'SELECT UserRequest'
        return controller.getAll(request, key, username, password);
    }

    return {
        getAll,
    };
}