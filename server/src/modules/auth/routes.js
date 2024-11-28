const express = require('express');
const answers = require('../../red/answers');
const controller = require('./index');
const router = express.Router();

router.post('/', login);

async function login(req, res, next) {
    try {
        const token = await controller.login(req.body.username, req.body.password);
        answers.success(req, res, token, 200);
    } catch (error) {
        if (error.message.includes('Credenciales incorrectas')) {
            answers.error(req, res, 'Credenciales incorrectas', 401);
        } else {
            answers.error(req, res, 'Error al autenticar el usuario', 500);
        }
        next(error);
    }
}

module.exports = router;
