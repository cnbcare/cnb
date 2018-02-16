"use strict";
const express = require('express'),
    HttpStatus = require('http-status-codes'),
    router = express.Router();

const pool = require('./../../database/connection');

const logger = require('./../../utils/logger'),
    sample_apiService = require('./sample-apiService');
/**
 * @swagger
 * /api/sample/v1/hello:
 *   get:
 *     tags:
 *       - sample
 *     description: Hello world sample
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: success
 */
router.get('/sample/v1/hello', (req, res) => {
    sample_apiService.message()
        .then((result) => {
            logger.debug(result);
            res.status(HttpStatus.OK).send(result);
        });
});

router.get('/users', (req, res) => {
    pool.query('SELECT * FROM test.user')
        .then(rows => {
            res.status(HttpStatus.OK).send(rows);
        })
        .catch((error) => {
            pool.close()
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        });
});

module.exports = router;