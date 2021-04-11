"use strict";
const mongoose = require("mongoose");
const BidSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "items"
    },
    amount: {
        type: Number,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    }
});

exports.Bid = mongoose.model("bid", BidSchema);