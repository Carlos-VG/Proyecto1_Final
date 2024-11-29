const request = 'UserRequest';

module.exports = function (centralAccessInjected) {
    let controller = centralAccessInjected;

    if (!controller) {
        controller = require('../../centralAccess/dataFetcher');
    }

    // Consulta para todos los casos reportados
    async function getAll(username, password) {
        const key = 'SELECT UserRequest WHERE 1';
        return controller.getAll(request, key, username, password);
    }

    return {
        getAll
    };
}
