"use strict";
const mongoose = require("mongoose");
const AutoBidSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "items"
    },
    max: {
        type: Number,
        required: true,
    },
    credit: {
        type: Number,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    }
});

exports.AutoBid = mongoose.model("autobid", AutoBidSchema);