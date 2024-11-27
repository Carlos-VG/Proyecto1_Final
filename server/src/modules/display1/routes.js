const express = require('express');
const answers = require('../../red/answers');
const controller = require('./index');
const cleanData = require('../../dataProcessing/cleanData/cleanRows');
const path = require('path');
const router = express.Router();

const desiredColumns = [
    'ref',
    'priority',
    'impact',
    'origin',
    'urgency',
    'request_type',
    'time_spent',
    'org_id',
    'org_name',
    'service_id',
    'service_name',
    'operational_status',
    'team_id',
    'team_id_friendlyname',
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
