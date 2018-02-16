"use strict";
const express = require('express'),
    HttpStatus = require('http-status-codes'),
    router = express.Router();

const pool = require('./../database/connection');

router.post('/v1/mesure_sante', (req, res) => {
    let data = req.body;
    console.log(data);
    
    let query = `CALL maj_mesure(?, ?, ?, ?, ?)`;
    let dataToInsert = [];

    if (data.bpm.value !== 0 && data.bpm.value !== null) {
        dataToInsert.push(['bpm', data.user, data.montre, data.timestamp, data.bpm.value]);
    }
    if (data.breathData.value !== 0 && data.breathData.value !== null) {
        dataToInsert.push(['breathData', data.user, data.montre, data.timestamp, data.breathData.value]);
    }
    if (data.spo2.value !== 0 && data.spo2.value !== null) {
        dataToInsert.push(['spo2', data.user, data.montre, data.timestamp, data.spo2.value]);
    }
    if (data.bvp.value1 !== 0 && data.bvp.value1 !== null) {
        dataToInsert.push(['bvp', data.user, data.montre, data.timestamp, data.bvp.value1]);
    } 
    if (data.bvp.value2 !== 0 && data.bvp.value2 !== null) {
        dataToInsert.push(['bvp2', data.user, data.montre, data.timestamp, data.bvp.value2]);
    }
    dataToInsert.forEach((row)=>{
        pool.query(query, row)
        .then(results => {
            res.status(HttpStatus.CREATED).send(results);
        })
        .catch((error) => {
            pool.close();
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        });
    })

});

router.get('/v1/mesure_sante', (req, res) => {
    let query = 'SELECT * FROM mesure';
    pool.query(query)
        .then(rows => {
            res.status(HttpStatus.OK).send(rows);
        })
        .catch((error) => {
            pool.close();
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        });
});

router.get('/v1/mesure_sante/:user', (req, res) => {
    let user = req.params.user;
    let query =  `SELECT * FROM mesure WHERE mesure.patient_id = (
        SELECT id FROM patient WHERE patient.login=?)`;
    pool.query(query, user)
        .then(rows => {
            res.status(HttpStatus.OK).send(rows);
        })
        .catch((error) => {
            pool.close();
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        });
});

module.exports = router;