'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var Map = require('../api/map/map.model');

// Passport Configuration
require('./local/passport').setup(Map, config);

var router = express.Router();

router.use('/local', require('./local'));

module.exports = router;
