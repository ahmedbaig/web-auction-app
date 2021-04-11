"use strict";
const moment = require("moment");
const Joi = require("joi");

//************************ VALIDATE ITEM DATA ***********************//
const validateItemData = async(data) => {
    const schema = Joi.object().keys({
        name: Joi.string(),
        description: Joi.string(),
        image: Joi.string(),
        price: Joi.number(),
        expireDate: Joi.date().min(moment().startOf("day").toString()).required(),
    });
    return Joi.validate(data, schema);
};

//************************ VALIDATE BID DATA ***********************//
const validateBidData = async(data) => {
    const schema = Joi.object().keys({
        user: Joi.string(),
        item: Joi.string(),
        amount: Joi.number(),
    });
    return Joi.validate(data, schema);
};

//************************ VALIDATE AUTO BID DATA ***********************//
const validateAutoBidData = async(data) => {
    const schema = Joi.object().keys({
        user: Joi.string(),
        item: Joi.string(),
        max: Joi.string(),
        credit: Joi.number(),
    });
    return Joi.validate(data, schema);
};

exports.validateItemData = validateItemData;
exports.validateBidData = validateBidData;
exports.validateAutoBidData = validateAutoBidData;