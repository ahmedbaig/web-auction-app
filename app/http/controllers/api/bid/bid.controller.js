"use strict";

const _ = require("lodash");
const BidService = require("../../services/bid.service")
const AutoBidService = require("../../services/auto-bid.service")
exports.get = async function(req, res) {
    try {
        var limit = _.toInteger(req.query.limit);
        var page = _.toInteger(req.query.page);
        BidService.findLimitPage({}, page, limit)
            .then(({ bids, count }) => {
                res.send({
                    success: true,
                    bids,
                    page: page,
                    pages: Math.ceil(count / limit),
                    count
                })
            })
            .catch(error => {
                res.status(400).send({ success: false, msg: error.message });
            })
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
};

exports.bid = async function(req, res) {
    try {
        BidService.create(req.body)
            .then(item => {
                res.send({
                    success: true,
                    bid
                })
            })
            .catch(error => {
                res.status(400).send({ success: false, msg: error.message });
            })

    } catch (error) {
        res.send({ success: false, message: error.message });
    }
};

exports.bidConfigure = async function(req, res) {
    try {} catch (error) {
        res.send({ success: false, message: error.message });
    }
};

exports.bidBotConfigure = async function(req, res) {
    try {} catch (error) {
        res.send({ success: false, message: error.message });
    }
};