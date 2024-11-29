const request = 'UserRequest';
const auth = require('../../../auth');

module.exports = function (centralAccessInjected) {
    let controller = centralAccessInjected;

    if (!controller) {
        controller = require('../../centralAccess/dataFetcher');
    }

    async function login(username, password) {
        try {
            const key = 'SELECT Organization';

            const data = await controller.getAll(request, key, username, password);

            if (!data || !data.objects || Object.keys(data.objects).length === 0) {
                throw new Error('Credenciales incorrectas');
            }
            const payload = {
                username: username,
                password: password,
            };
            const token = auth.asignarToken(payload);

            return token;

        } catch (error) {
            throw new Error('Credenciales incorrectas');
        }
    }

    return {
        login,
    };
}