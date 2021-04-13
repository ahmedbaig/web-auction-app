"use strict";

const _ = require("lodash");
const moment = require("moment");
const BidService = require("../../services/bid.service")
const AutoBidService = require("../../services/auto-bid.service")
const ItemService = require("../../services/item.service");
const { reject } = require("lodash");
exports.get = async function(req, res) {
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

exports.bid = async function(req, res) {
    try {
        var todayDate = moment().startOf('day');
        BidService.findLastDocument({ item: req.body.item })
            .then(last_bid => {
                if (last_bid.length != 0) {
                    console.log("OLD BID", last_bid)
                        // BIDS EXIST
                    if (last_bid[0].amount >= req.body.amount) {
                        return res.status(409).send({
                            success: false,
                            msg: "Bidding amount too low"
                        })
                    } else if (last_bid[0].user == req.body.user) {
                        return res.status(409).send({
                            success: false,
                            msg: "You already own the latest bid. Cannot bid again"
                        })
                    } else {
                        BidService.createNewBid(req.body)
                            .then(bid => { return res.send({ success: true, bid, msg: "Bid created successfully" }) })
                            .catch(error => { return res.status(400).send({ success: false, msg: error.message }) });
                    }
                } else {
                    console.log("NO OLD BID", req.body.item)
                        // NO BID SO FAR 
                    ItemService.findOne({ _id: req.body.item, expireDate: { '$gte': moment(todayDate).format('MM-DD-YYYY') } })
                        .then(item => {
                            if (item == null) {
                                res.status(400).send({
                                    success: false,
                                    msg: "Item not found"
                                })
                            }
                            console.log("THE REAL ITEM", item)
                            if (item.price >= req.body.amount) {
                                return res.status(409).send({
                                    success: false,
                                    msg: "Bidding amount too low"
                                })
                            } else {
                                BidService.createNewBid(req.body)
                                    .then(bid => {
                                        return res.send({ success: true, bid, msg: "Bid created successfully" })
                                    })
                                    .catch(error => { return res.status(400).send({ success: false, msg: error.message }) });
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

exports.bidAuto = async function(req, res) {
    try {
        var todayDate = moment().startOf('day');
        AutoBidService.find({ item: req.body.item })
            .then(bots => {
                if (bots) {
                    // All Bots With Listening for this item
                    ItemService.findOne({ _id: req.body.item, expireDate: { '$gte': moment(todayDate).format('MM-DD-YYYY') } })
                        .then(item => {
                            if (item == null) {
                                res.status(400).send({
                                    success: false,
                                    msg: "Item not found"
                                })
                            }
                            BidService.findLastDocument({ item: req.body.item })
                                .then(last_bid => {
                                    let lastBidAmount = 0
                                    let lastBidUser = ""
                                    if (last_bid.length != 0) {
                                        lastBidAmount = last_bid[0].amount
                                        lastBidUser = last_bid[0].user
                                    }
                                    let newBidsCache = []
                                    Promise.all(bots.map(bot => {
                                        return new Promise((resolve, reject) => {
                                            if (bot.max >= bot.credit) {
                                                if ((bot.credit + item.price) > bot.max && (bot.max - bot.credit) < item.price) {
                                                    console.log("Cannot deploy bot. Bidding value exceeds max bidding value", bot)
                                                    resolve({ msg: "Cannot deploy bot. Bidding value exceeds max bidding value", bot })
                                                } else {
                                                    let user_bid = {
                                                        user: bot.user,
                                                        amount: item.price + 1,
                                                        item: req.body.item
                                                    }
                                                    if (last_bid.length != 0) {
                                                        if (lastBidUser == user_bid.user) {
                                                            return resolve({ msg: "You already own the latest bid. Cannot bid again", bot })
                                                        }
                                                        user_bid.amount = lastBidAmount + 1
                                                    }
                                                    lastBidAmount = user_bid.amount;
                                                    lastBidUser = user_bid.user
                                                    let bot_credit = bot.credit + user_bid.amount;
                                                    AutoBidService.findByIdAndUpdate(bot.id, { credit: bot_credit })
                                                        .then(updatedbot => {})
                                                    newBidsCache.push(user_bid)
                                                    resolve({ msg: "Bid created successfully", bid: user_bid })
                                                }
                                            } else {
                                                resolve({ msg: "Cannot deploy bot. Max bidding value reached", bot })
                                            }
                                        })
                                    })).then(data => {
                                        BidService.createMany(newBidsCache)
                                            .then(bid => {
                                                res.send({ success: true, msg: "Bids created successfully", data })
                                            })
                                    })
                                })
                        })
                        .catch(error => {
                            res.status(400).send({ success: false, msg: error.message });
                        })
                } else {
                    res.status(400).send({
                        success: false,
                        msg: "No bots found"
                    })
                }
            })
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

exports.bidConfigure = async function(req, res) {
    try {
        var todayDate = moment().startOf('day');
        AutoBidService.findOneNoPopulate({ user: req.body.user })
            .then(bot => {
                if (bot != null) {
                    if (_.find(bot.item, function(it) { return it == req.body.item; })) {
                        // STOP BOT 
                        AutoBidService.findByIdAndUpdate(bot._id, { item: _.reject(bot.item, function(it) { return it == req.body.item }) })
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
                        ItemService.findOne({ _id: req.body.item, expireDate: { '$gte': moment(todayDate).format('MM-DD-YYYY') } })
                            .then(item => {
                                if (item == null) {
                                    res.status(400).send({
                                        success: false,
                                        msg: "Item not found"
                                    })
                                }
                                if (bot.max >= bot.credit) {
                                    if ((bot.credit + item.price) > bot.max && (bot.max - bot.credit) < item.price) {
                                        console.log(`Bot: ${bot}, Item: ${item}`)
                                        res.status(409).send({
                                            success: false,
                                            msg: "Cannot deploy bot. Bidding value exceeds max bidding value"
                                        })
                                    } else {
                                        let biddingItems = bot.item;
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
                                    console.log(bot.max >= bot.credit)
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
                    res.status(400).send({
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

exports.bidBotConfigure = async function(req, res) {
    try {
        AutoBidService.findOne({ user: req.body.user }).then(bot => {
            if (!bot) {
                console.log("No bot found")
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