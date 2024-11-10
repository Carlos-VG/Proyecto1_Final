const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const error = require('./red/errors');

const config = require('./config');
const display3 = require('./modules/display3/routes');
const app = express();

/**
 * @brief Middleware para el manejo de JSON
 */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.set('port', config.app.port);

app.use('/api/display3', display3);
app.use(error);

module.exports = app;