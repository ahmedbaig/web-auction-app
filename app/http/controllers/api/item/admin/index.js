'use strict';

const express = require('express')
const controller = require('./item.admin.controller')
const router = express.Router()
const role = require("../../../../middleware/role")
router.get('/get', controller.get)

router.post('/create', role.checkAdmin(), controller.create)

module.exports = router;