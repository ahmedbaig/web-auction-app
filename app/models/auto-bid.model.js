"use strict";
const mongoose = require("mongoose");
const AutoBidSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    item: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "items"
    }],
    max: {
        type: Number,
        required: true,
    },
    credit: {
        type: Number,
        default: 0,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    }
});

exports.AutoBid = mongoose.model("autobid", AutoBidSchema);