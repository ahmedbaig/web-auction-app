"use strict";

const _ = require("lodash");
const BidService = require("../../services/bid.service")
const AutoBidService = require("../../services/auto-bid.service")
const ItemService = require("../../services/item.service");
const { last } = require("lodash");
exports.get = async function (req, res) {
    try {
        var limit = _.toInteger(req.query.limit);
        var page = _.toInteger(req.query.page);
        let query = {}
        if (req.query.item != "" && req.query.item != "" && req.query.item != undefined) {
            query['item'] = req.query.item;
        }

        BidService.findLimitPage(query, page, limit)
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
        res.status(500).send({ success: false, message: error.message });
    }
};

exports.bid = async function (req, res) {
    try {
        let createNewBid = () => {
            BidService.create(req.body)
                .then(bid => {
                    console.log("All good", req.body, bid)
                    return res.send({
                        success: true,
                        bid
                    })
                })
                .catch(error => {
                    res.status(400).send({ success: false, msg: error.message });
                })
        }
        let conflictError = (msg) => {
            return res.status(409).send({
                success: false,
                msg
            })
        }
        BidService.findLastDocument({ item: req.body.item })
            .then(last_bid => {
                if (last_bid.length != 0) {
                    console.log("OLD BID", last_bid)
                    // BIDS EXIST
                    if (last_bid[0].amount >= req.body.amount) {
                        return conflictError("Bidding amount too low");
                    } else if (last_bid[0].user == req.body.user) {
                        return conflictError("You already own the latest bid. Cannot bid again");
                    } else {
                        return createNewBid();
                    }
                } else {
                    console.log("NO OLD BID", req.body.item)
                    // NO BID SO FAR 
                    ItemService.findById(req.body.item)
                        .then(item => {
                            console.log("THE REAL ITEM", item)
                            if (item.price >= req.body.amount) {
                                return conflictError("Bidding amount too low");
                            } else {
                                return createNewBid();
                            }
                        })
                        .catch(error => {
                            res.status(400).send({ success: false, msg: error.message });
                        })

                }
            })
            .catch(error => {
                res.status(400).send({ success: false, msg: error.message });
            })
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};

exports.bidConfigure = async function (req, res) {
    try {
        AutoBidService.findOneNoPopulate({ user: req.body.user })
            .then(bot => {
                if (bot != null) {
                    if (_.find(bot.item, function (it) { return it == req.body.item; })) {
                        // STOP BOT 
                        AutoBidService.findByIdAndUpdate(bod._id, { item: _.reject(bot.item, function (it) { return it == req.body.item }) })
                            .then(data => {
                                res.send({
                                    success: true,
                                    msg: "Auto bidding bot disabled for this item"
                                })
                            })
                            .catch(error => {
                                res.status(400).send({ success: false, msg: error.message });
                            })
                    } else {
                        // START BOT FOR THIS ITEM
                        ItemService.findById(req.body.item)
                            .then(item => {
                                if (bot.max != bot.credit) {
                                    if ((bot.credit + item.price) > bot.max && (bot.max - bot.credit) < item.price) {
                                        res.status(409).send({
                                            success: false,
                                            msg: "Cannot deploy bot. Bidding value exceeds max bidding value"
                                        })
                                    } else {
                                        let biddingItems = bot.items;
                                        biddingItems.push(req.body.item)
                                        AutoBidService.findByIdAndUpdate(bot._id, { item: biddingItems })
                                            .then(data => {
                                                res.send({
                                                    success: true,
                                                    msg: "Auto bidding bot enabled for this item"
                                                })
                                            })
                                    }
                                } else {
                                    res.status(409).send({
                                        success: false,
                                        msg: "Cannot deploy bot. Max bidding value reached"
                                    })
                                }
                            })
                            .catch(error => {
                                res.status(400).send({ success: false, msg: error.message });
                            })
                    }
                } else {
                    res.send({
                        success: false,
                        msg: "No bot found"
                    })
                }
            })
            .catch(error => {
                res.status(400).send({ success: false, msg: error.message });
            })
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};

exports.bidBotConfigure = async function (req, res) {
    try {
        AutoBidService.findOne({ user: req.body.user }).then(bot => {
            if (!bot) {
                // NO BOT FOUND WITH USER
                AutoBidService.create(req.body)
                    .then(newbot => {
                        res.send({
                            success: true,
                            bot: newbot,
                            msg: "Auto bidding bot created"
                        })
                    })
                    .catch(error => {
                        res.status(400).send({ success: false, msg: error.message });
                    })
            } else {
                // BOT FOUND WITH USER
                req.body.credit = 0;
                AutoBidService.findByIdAndUpdate(req.query.id, req.body)
                    .then(updatedbot => {
                        res.send({
                            success: true,
                            bot: updatedbot,
                            msg: "Auto bidding bot updated"
                        })
                    })
                    .catch(error => {
                        res.status(400).send({ success: false, msg: error.message });
                    })
            }
        }).catch(error => {
            res.status(400).send({ success: false, msg: error.message });
        })

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};