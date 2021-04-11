'use strict';

const { Item } = require('../../../models/item.model');
const moment = require('moment');

exports.create = function(itemData) {
    return new Promise(function(resolve, reject) {
        Item.create(itemData, function(err, item) {
            if (err) {
                reject(err);
            } else {
                resolve(item);
            }
        })

    })
}

exports.findLimitPage = function(query, page, limit) {
    return new Promise(function(resolve, reject) {
        Item.find(query)
            .skip(limit * (page - 1) ? limit * (page - 1) : 0)
            .limit(limit ? limit : 50)
            .sort({ createdDate: 1 })
            .exec(function(err, items) {
                if (err) {
                    reject(err);
                }
                Item.count(query).exec(async function(err, count) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ items, count });
                    }
                })
            })

    })
}

exports.findById = function(id) {
    return new Promise(function(resolve, reject) {
        Item.findById(id, function(err, item) {
            if (err) {
                reject(err);
            } else if (!item) {
                reject('Item not found.');
            } else {
                resolve(item);
            }
        })

    })
}

exports.lookup = function(query) {
    return new Promise(function(resolve, reject) {
        Item.aggregate(query, function(err, item) {
            if (err) {
                reject(err);
            } else if (!item) {
                reject('Item not found.');
            } else {
                resolve(item);
            }
        })

    })
}

const update = function(query, data, options) {
    return new Promise(function(resolve, reject) {
        Item.update(query, data, options, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })

    })
}

exports.find = function(query) {
    return new Promise(function(resolve, reject) {
        Item.find(query, function(err, items) {
            if (err) {
                reject(err);
            } else {
                resolve(items);
            }
        })

    })
}

exports.findOne = function(query) {
    return new Promise(function(resolve, reject) {
        Item.findOne(query, function(err, user) {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        })

    })
}

const findOneAndUpdate = function(query, data, options) {
    return new Promise(function(resolve, reject) {
        Item.findOneAndUpdate(query, data, options, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })

    })
}

exports.findOneAndRemove = function(query) {
    return new Promise(function(resolve, reject) {
        Item.findOneAndRemove(query, function(err, users) {
            if (err) {
                reject(err);
            } else {
                resolve(users);
            }
        })

    })
}


exports.findOneAndUpdate = findOneAndUpdate;
exports.update = update;