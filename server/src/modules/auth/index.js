const centralAccess = require('../../centralAccess/dataFetcher');
const ctrl = require('./controller');

module.exports = ctrl(centralAccess);