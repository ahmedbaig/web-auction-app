'use strict';

const { Bid } = require('../../../models/bid.model');
exports.create = function(bidData) {
    return new Promise(function(resolve, reject) {
        Bid.create(bidData, function(err, bid) {
            if (err) {
                reject(err);
            } else {
                resolve(bid);
            }
        })

    })
}

exports.findById = function(id) {
    return new Promise(function(resolve, reject) {
        Bid.findById(id, function(err, bid) {
            if (err) {
                reject(err);
            } else if (!bid) {
                reject({ msg: 'Bid not found.' });
            } else {
                resolve(bid);
            }
        })

    })
}

exports.find = function(query) {
    return new Promise(function(resolve, reject) {
        Bid.find(query, function(err, bids) {
            if (err) {
                reject(err);
            } else {
                resolve(bids);
            }
        })

    })
}

exports.findLimitPage = function(query, page, limit) {
    return new Promise(function(resolve, reject) {
        Bid.find(query)
            .skip(limit * (page - 1) ? limit * (page - 1) : 0)
            .limit(limit ? limit : 50)
            .sort({ createdDate: 1 })
            .exec(function(err, bids) {
                if (err) {
                    reject(err);
                }
                Bid.count(query).exec(async function(err, count) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ bids, count });
                    }
                })
            })

    })
}