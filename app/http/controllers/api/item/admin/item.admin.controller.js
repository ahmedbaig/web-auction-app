"use strict";

const _ = require("lodash");
const ItemService = require("../../../services/item.service")
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
        res.send({ success: false, message: error.message });
    }
};

exports.create = function(req, res) {
    try {
        ItemService.create(req.body)
            .then(item => {
                res.send({
                    success: true,
                    item
                })
            })
            .catch(error => {
                res.status(400).send({ success: false, msg: error.message });
            })

    } catch (error) {
        res.send({ success: false, message: error.message });
    }
}