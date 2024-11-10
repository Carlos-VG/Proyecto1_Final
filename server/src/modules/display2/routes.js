const express = require('express');
const answers = require('../../red/answers');
const controller = require('./index');
const router = express.Router();

router.post('/reportedCase', getReportedCase);
router.post('/resolvedOrClosedCase', getResolvedOrClosedCase);

async function getReportedCase(req, res, next) {
    try {
        const items = await controller.getAllReportedCases();
        answers.success(req, res, items, 200);
    } catch (error) {
        answers.error(req, res, 'error', 500);
        next(error);
    }
}

async function getResolvedOrClosedCase(req, res, next) {
    try {
        const items = await controller.getAllResolvedOrClosedCases();
        answers.success(req, res, items, 200);
    } catch (error) {
        answers.error(req, res, 'error', 500);
        next(error);
    }
}

module.exports = router;
