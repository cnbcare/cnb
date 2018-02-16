"use strict";
const winston = require('winston'),
    config = require('./../config');
winston.emitErrs = true;

require('winston-logstash');

// Define levels to be like log4j in java
const customLevels = {
    levels: {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3
    }
};

const logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: config.logs.level,
            levels: customLevels.levels,
            filename: config.logs.path + config.logs.file,
            handleExceptions: true,
            json: false,
            maxsize: config.logs.max_size, //5MB
            maxFiles: config.logs.max_file,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false,
            colorize: true
        }),
        new winston.transports.Logstash({
            port: config.logs.logstash_port,
            node_name: config.logs.logstash_node_name,
            host: config.logs.logstash_host,
            max_connect_retries: -1
        })
    ],
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function(message) {
        logger.info(message.slice(0, -1));

    }
};