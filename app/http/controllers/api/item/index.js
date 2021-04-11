'use strict';

var express = require('express');
var controller = require('./item.controller')
var router = express.Router();

router.get('/get', controller.get)

router.get('/get/:id', controller.getById)

router.post('/search', controller.search)

module.exports = router;