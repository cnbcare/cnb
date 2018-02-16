"use strict";
const request = require('request'),
    HttpStatus = require('http-status-codes');
require('./../../../bin/www');


jasmine.getEnv().defaultTimeoutInterval = 500;

const endpoint = 'http://localhost:3000/api/sample/v1/hello';

describe("sample-api", () => {
    describe('/ GET', () => {
        it('returns status code 200', (done) => {
            request.get(endpoint, (error, response) => {
                expect(response.statusCode).toEqual(HttpStatus.OK);
                done();
            });
        });
    });
});