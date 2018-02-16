"use strict";
const swaggerJSDoc = require('swagger-jsdoc'),
    loggers = require('../logger');

loggers.debug("Getting the configuration of swagger with jsdoc");

// swagger definition
const swaggerDefinition = /* istanbul ignore next */ (req) => {

    return {
        info: {
            title: 'Starter Kit Expressjs',
            version: '1.0.0',
            description: 'Starter Kit RESTful API with Expressjs '
        },
        host: req.get('Host') //,
            //basePath: '/api'
    };
};

// options for the swagger docs
const options = /* istanbul ignore next */ (req) => {
    return {
        // import swaggerDefinitions
        swaggerDefinition: swaggerDefinition(req),
        // path to the API docs
        apis: ['./app/routes/*/*.js']
    };
};

const swaggerSpecGenerator = {
    generate: (req) => {
        /* istanbul ignore next */
        return swaggerJSDoc(options(req));
    }
};

module.exports = swaggerSpecGenerator;