const express = require('express');
const answers = require('../../red/answers');
const controller = require('./index');
const router = express.Router();

router.post('/', getAll);

async function getAll(req, res, next) {
    try {
        const items = await controller.getAll();
        answers.success(req, res, items, 200);
    } catch (error) {
        answers.error(req, res, 'error', 500);
        next(error);
    }
}

module.exports = router;
