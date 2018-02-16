"use strict";
const HttpStatus = require('http-status-codes');

const constErreur = require('./constantsError'),
    logger = require('./logger');

module.exports = {
    sendError: (res, error) => {
        logger.error(error);
        if (error.code === constErreur.BAD_REQUEST) {
            res.sendStatus(HttpStatus.BAD_REQUEST);
            return;
        } else {
            res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            return;
        }
    },
    sendResponse: (res, result) => {
        if (result.rows.length < 1) {
            res.sendStatus(HttpStatus.NOT_FOUND);
        } else {
            res.status(HttpStatus.OK).send(result);
        }
    },
    sendStatus: (res, result, statusCode) => {
        if (result.rows.length < 1) {
            res.sendStatus(HttpStatus.NOT_FOUND);
        } else {
            res.sendStatus(statusCode);
        }
    }
};