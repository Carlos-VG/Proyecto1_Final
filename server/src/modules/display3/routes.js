const express = require('express');
const path = require('path');
const answers = require('../../red/answers');
const controller = require('./index');
const cleanData = require('../../dataProcessing/cleanData/cleanRows');
const router = express.Router();

const desiredColumns = [
    'service_name',
    'servicesubcategory_name',
    'time_spent',
    'start_date',
    'last_update',
    'close_date',
    'assignment_date',
    'resolution_date'
];

const pythonScriptPath = path.join(__dirname, '../../dataProcessing/scripts/script1.py');

router.post('/', getAll);

async function getAll(req, res, next) {
    try {
        const items = await controller.getAll();
        const cleanedData = await cleanData(items, desiredColumns, true, pythonScriptPath);
        answers.success(req, res, cleanedData, 200);
    } catch (error) {
        answers.error(req, res, 'error', 500);
        next(error);
    }
}

module.exports = router;
