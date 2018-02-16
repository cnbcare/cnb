"use strict";
const express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    log = require('winston'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    validator = require('express-validator'),
    fs = require('fs');

log.default.transports.console.colorize = true;

const loggers = require('./app/utils/logger'),
    sampleApiRoutes = require('./app/routes/sample-api/sample-apiRouter'),
    integrationMesure = require('./app/routes/integrationMesure'),
    swaggerRoutes = require('./app/routes/swagger'),
    packageJSON = require('./package');

const app = express();

loggers.info("Starting 'Express'");
loggers.info(`project version: ${packageJSON.version}`);

app.use(require('morgan')('combined', { stream: loggers.stream }));

process.on('unhandledRejection', (reason) => {
    loggers.error("Unhandled Rejection:", reason);
});
process.on('uncaughtException', (reason) => {
    loggers.error("uncaughtException", reason);
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//CORS middleware
const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, application/json, charset=utf-8, X-Requested-With');

    next();
};

if (app.get('env') === 'production') {
    const accessLogStream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' });
    app.use(logger('common', {
        skip: (req, res) => {
            return res.statusCode < 400;
        },
        stream: accessLogStream
    }));
} else {
    app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(validator());
app.use(express.static(path.join(__dirname, 'public')));
app.use(allowCrossDomain);

app.use('/api', sampleApiRoutes);
app.use('/', swaggerRoutes);
app.use('/api', integrationMesure);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;