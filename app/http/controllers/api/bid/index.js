'use strict';

const express = require('express');
const controller = require('./bid.controller')
const validator = require("../../../middleware/validation")
const router = express.Router()

router.get('/get', controller.get)

router.post('/bid', validator.validateBid(), controller.bid)

router.post('/bid/configure', validator.validateAutoBid(), controller.bidConfigure)

router.post('/bid/bot/:id', validator.validateAutoBid(), controller.bidBotConfigure)

module.exports = router;