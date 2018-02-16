"use strict";

module.exports.message = () => {
    return new Promise((resolve) => {
        resolve({ "Hello Nodejs": "with fwk Experssjs" });
    });
};