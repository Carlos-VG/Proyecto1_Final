const express = require('express');
const answers = require('../../red/answers');
const controller = require('./index');
const router = express.Router();
const cleanData = require('../../dataProcessing/cleanData/cleanRows');
const security = require('../../middleware/security');
const path = require('path');

const desiredColumns = [
    'ref',
    'org_id',
    'org_name',
    'time_spent',
    'service_name',
    'operational_status'
];

const filters = [,
    'service_name',
    'operational_status'
];

const pythonScriptPath = path.join(__dirname, '../../dataProcessing/scripts/script4.py');

router.post('/', security(), getAll);

async function getAll(req, res, next) {
    try {
        const items = await controller.getAll(req.user.username, req.user.password);
        const cleanedData = await cleanData(items, desiredColumns, true, pythonScriptPath, filters);
        answers.success(req, res, cleanedData, 200);
    } catch (error) {
        answers.error(req, res, 'error', 500);
        next(error);
    }
}

module.exports = router;
