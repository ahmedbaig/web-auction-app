"use strict";

const _ = require("lodash");
const moment = require("moment");
const mongoose = require("mongoose");
const ItemService = require("../../services/item.service")
exports.get = function(req, res) {
    try {
        var todayDate = moment().startOf('day');
        var limit = _.toInteger(req.query.limit);
        var page = _.toInteger(req.query.page);
        ItemService.findLimitPage({ expireDate: { '$gte': moment(todayDate).format('MM-DD-YYYY') } }, page, limit)
            .then(({ items, count }) => {
                res.send({
                    success: true,
                    items,
                    page: page,
                    pages: Math.ceil(count / limit),
                    count
                })
            })
            .catch(error => {
                res.status(400).send({ success: false, msg: error.message });
            })
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};

exports.getById = async function(req, res) {
    try {
        let queryArr = [
            { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
            {
                $lookup: {
                    from: "bids",
                    localField: "_id",
                    foreignField: "item",
                    as: "bids"
                }
            }
        ];
        ItemService.lookup(queryArr).then(item => {
                res.send({
                    success: true,
                    item
                })
            })
            .catch(error => {
                res.status(400).send({ success: false, msg: error.message });
            })
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};

exports.search = async function(req, res) {
    try {
        var todayDate = moment().startOf('day');
        var limit = _.toInteger(req.query.limit);
        var page = _.toInteger(req.query.page);
        let queryStr = {}
        if (req.body.keyword != "" && req.body.keyword != null && req.body.keyword != undefined) {
            var key = new RegExp('(?=.*' + req.body.keyword.split(/\,|\s/).join(')(?=.*') + ')', 'gi');
            queryStr = { $or: [{ name: key }, { description: key }], expireDate: { '$gte': moment(todayDate).format('MM-DD-YYYY') } }
            ItemService.findLimitPage(queryStr, page, limit)
                .then(({ items, count }) => {
                    res.send({
                        success: true,
                        items,
                        page: page,
                        pages: Math.ceil(count / limit),
                        count
                    })
                })
                .catch(error => {
                    res.status(400).send({ success: false, msg: error.message });
                })
        } else {
            ItemService.findLimitPage({ expireDate: { '$gte': moment(todayDate).format('MM-DD-YYYY') } }, page, limit)
                .then(({ items, count }) => {
                    res.send({
                        success: true,
                        items,
                        page: page,
                        pages: Math.ceil(count / limit),
                        count
                    })
                })
                .catch(error => {
                    res.status(400).send({ success: false, msg: error.message });
                })
        }
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};