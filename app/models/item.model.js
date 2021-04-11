"use strict";
const mongoose = require("mongoose");
const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    expireDate: {
        type: Date,
        default: null,
    }
});

exports.Item = mongoose.model("items", ItemSchema);