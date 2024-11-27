const express = require('express');
const answers = require('../../red/answers');
const controller = require('./index');
const router = express.Router();
const cleanData = require('../../dataProcessing/cleanData/cleanRows');
const path = require('path');


const desiredColumns = [
    'ref',
    'operational_status'
];

const pythonScriptPath = path.join(__dirname, '../../dataProcessing/scripts/script2.py');

router.post('/reportedCase', getReportedCase);
router.post('/resolvedOrClosedCase', getResolvedOrClosedCase);

async function getReportedCase(req, res, next) {
    try {
        const items = await controller.getAllReportedCases();
        const cleanedData = await cleanData(items, desiredColumns, true, pythonScriptPath);
        answers.success(req, res, cleanedData, 200);
    } catch (error) {
        answers.error(req, res, 'error', 500);
        next(error);
    }
}

async function getResolvedOrClosedCase(req, res, next) {
    try {
        const items = await controller.getAllResolvedOrClosedCases();
        const cleanedData = await cleanData(items, desiredColumns, true, pythonScriptPath);
        answers.success(req, res, cleanedData, 200);
    } catch (error) {
        answers.error(req, res, 'error', 500);
        next(error);
    }
}

module.exports = router;
