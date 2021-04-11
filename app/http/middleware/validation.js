"use strict";
const compose = require("composable-middleware");
const { validateAutoBidData, validateBidData, validateItemData } = require("../controllers/Validate");
exports.validateBid = function validateBid() {
    return (
        compose()
        .use(async function(req, res, next) {
            validateBidData(req.body)
                .then((data) => {
                    next();
                })
                .catch(error => {
                    var errors = {
                        success: false,
                        msg: error.details[0].message,
                        data: error.name,
                    };
                    res.status(400).send(errors);
                    return;
                });
        })
    );
};
exports.validateAutoBid = function validateAutoBid() {
    return (
        compose()
        .use(async function(req, res, next) {
            validateAutoBidData(req.body)
                .then((data) => {
                    next();
                })
                .catch(error => {
                    var errors = {
                        success: false,
                        msg: error.details[0].message,
                        data: error.name,
                    };
                    res.status(400).send(errors);
                    return;
                });
        })
    );
};
exports.validateItem = function validateItem() {
    return (
        compose()
        .use(async function(req, res, next) {
            validateItemData(req.body)
                .then((data) => {
                    next();
                })
                .catch(error => {
                    var errors = {
                        success: false,
                        msg: error.details[0].message,
                        data: error.name,
                    };
                    res.status(400).send(errors);
                    return;
                });
        })
    );
};