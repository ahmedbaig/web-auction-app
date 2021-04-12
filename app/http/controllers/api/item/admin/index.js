'use strict';

const express = require('express')
const controller = require('./item.admin.controller')
const router = express.Router()
const role = require("../../../../middleware/role")
const validator = require("../../../../middleware/validation")
const upload = require("../../../../../constants/multer");

router.post('/create', role.checkAdmin(), validator.validateBid(), upload.fields([{ name: "image" }]), controller.create)

module.exports = router;