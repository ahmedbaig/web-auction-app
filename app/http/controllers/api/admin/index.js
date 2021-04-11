'use strict';

var express = require('express');
var auth = require('../../../middleware/auth'); 
var controller = require('./admin.controller')
var router = express.Router();

router.post('/search', auth.isAuthenticated(), controller.search)

module.exports = router;