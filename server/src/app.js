const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const error = require('./red/errors');

const config = require('./config');
const display1 = require('./modules/display1/routes');
const display2 = require('./modules/display2/routes');
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

app.use('/api/display1', display1);
app.use('/api/display2', display2);
app.use('/api/display3', display3);
app.use(error);

module.exports = app;