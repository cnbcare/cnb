"use strict";
const loggers = require('../logger');

loggers.debug("Getting the configuration of swagger with swagger.json");

const swaggerSpecGenerator = {
    generate: (req) => {
        let swaggerDocument = require('./swagger.json');
        swaggerDocument.host = req.get('Host');
        return swaggerDocument;
    }
};

module.exports = swaggerSpecGenerator;