"use strict";
/**
 * /app/routes/swagger.js
 */
const express = require('express'),
    router = express.Router();
//Decomments the line to use swagger-jsdoc and comment swagger-json
const swaggerSpecGenerator = require('../utils/swagger/swagger-jsdoc');
//const swaggerSpecGenerator = require('../utils/swagger/swagger-json'); //In this case we use the swagger-json

router.get('/', (req, res) => {
    let url = '/swaggerui?url=' + req.protocol + '://' + req.get('Host') + '/api-docs/swagger.json';
    res.redirect(url);
});

router.get('/api-docs', (req, res) => {
    res.redirect('./api-docs/swagger.json');
});

// serve swagger
router.get('/api-docs/swagger.json', (req, res) => {
    //delegate to swagger-json or swagger-jsdoc
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpecGenerator.generate(req));
});

module.exports = router;