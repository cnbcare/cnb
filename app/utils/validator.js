'use strict';
const validator = (req, res) =>
    new Promise((resolve) => {
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty() && result !== undefined) {
                    res.contentType('application/json')
                        .status(400)
                        .send(JSON.stringify({
                            success: false,
                            detailed_message: result.array()
                        }));
                } else {
                    resolve();
                }
            });

    });

module.exports = validator;