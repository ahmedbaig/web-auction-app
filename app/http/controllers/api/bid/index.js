'use strict';

const express = require('express');
const controller = require('./bid.controller')
const validator = require("../../../middleware/validation")
const router = express.Router()

router.get('/get/:item', controller.get)

router.post('/bid', validator.validateBid(), controller.bid)

router.post('/bid/auto', controller.bidAuto) // bot function API

router.post('/bid/auto/switcher', validator.validateAutoBidConfigure(), controller.bidConfigure) // auto bidder turn on/off

router.post('/bid/bot', validator.validateAutoBid(), controller.bidBotConfigure) // update bid bot

module.exports = router;