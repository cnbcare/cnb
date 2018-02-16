"use strict";
const config = require('./../config'),
    mysql = require('mysql'),
    logger = require('./../utils/logger');

class Database {
    constructor() {
        this.pool = mysql.createPool({
            connectionLimit: config.database.connectionLimit,
            host: config.database.host,
            user: config.database.user,
            password: config.database.password,
            database: config.database.database
        });
        this.pool.on('acquire', function(connection) {
            logger.debug('Connection %d acquired', connection.threadId);
        });
        this.pool.on('enqueue', function() {
            logger.warn('Waiting for available connection slot');
        });
        logger.info('Creating connection pooling');
    }
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function(err, connection) {
                if (err)
                    return reject(err);
                connection.query(sql, args, (err, rows) => {
                    connection.release();
                    if (err)
                        return reject(err);
                    resolve(rows);
                });
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                logger.info('Connection closed');
                resolve();
            });
        });
    }
}

module.exports = new Database();