'use strict';

const { AutoBid } = require('../../../models/auto-bid.model');
exports.create = function (bidData) {
    return new Promise(function (resolve, reject) {
        AutoBid.create(bidData, function (err, bid) {
            if (err) {
                reject(err);
            } else {
                resolve(bid);
            }
        })

    })
}

exports.findByIdAndUpdate = function (id, update) {
    return new Promise(function (resolve, reject) {
        AutoBid.findByIdAndUpdate(id, update, function (err, bid) {
            if (err) {
                reject(err);
            } else {
                resolve(bid);
            }
        })

    })
}

exports.findById = function (id) {
    return new Promise(function (resolve, reject) {
        AutoBid.findById(id, function (err, bid) {
            if (err) {
                reject(err);
            } else if (!bid) {
                reject({ msg: 'Bot not found.' });
            } else {
                resolve(bid);
            }
        })

    })
}

exports.find = function (query) {
    return new Promise(function (resolve, reject) {
        AutoBid.find(query, function (err, bids) {
            if (err) {
                reject(err);
            } else {
                resolve(bids);
            }
        })

    })
}

exports.findOneNoPopulate = function (query) {
    return new Promise(function (resolve, reject) {
        AutoBid.find(query, function (err, bids) {
            if (err) {
                reject(err);
            } else {
                resolve(bids);
            }
        })

    })
}

exports.findOne = function (query) {
    return new Promise(function (resolve, reject) {
        AutoBid.find(query, function (err, bids) {
            if (err) {
                reject(err);
            } else {
                resolve(bids);
            }
        })

    })
}

exports.findLimitPage = function (query, page, limit) {
    return new Promise(function (resolve, reject) {
        AutoBid.find(query)
            .skip(limit * (page - 1) ? limit * (page - 1) : 0)
            .limit(limit ? limit : 50)
            .sort({ createdDate: 1 })
            .exec(function (err, bots) {
                if (err) {
                    reject(err);
                }
                AutoBid.count(query).exec(async function (err, count) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ bots, count });
                    }
                })
            })

    })
}