const request = 'UserRequest';

module.exports = function (centralAccessInjected) {
    let controller = centralAccessInjected;

    if (!controller) {
        controller = require('../../centralAccess/dataFetcher');
    }

    // Consulta para casos con estado 'resolved' o 'closed'
    async function getAllResolvedOrClosedCases() {
        const key = 'SELECT UserRequest WHERE operational_status = "resolved" OR operational_status = "closed"';
        return controller.getAll(request, key);
    }

    // Consulta para todos los casos reportados
    async function getAllReportedCases() {
        const key = 'SELECT UserRequest WHERE 1';
        return controller.getAll(request, key);
    }

    return {
        getAllResolvedOrClosedCases,
        getAllReportedCases,
    };
}
