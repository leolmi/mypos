'use strict';

var express = require('express');
var controller = require('./shared.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/points/:id', auth.isAuthenticatedOnMap(), controller.indexPoints);
router.get('/messages/:id', auth.isAuthenticatedOnMap(), controller.indexMessages);
router.get('/ways/:id', auth.isAuthenticatedOnMap(), controller.indexWays);

router.post('/point/:id', auth.isAuthenticatedOnMap(), controller.createPoint);
router.post('/message/:id', auth.isAuthenticatedOnMap(), controller.createMessage);
router.post('/way/:id', auth.isAuthenticatedOnMap(), controller.createWay);

router.delete('/point/:id', auth.isAuthenticated(), controller.destroyPoint);
router.delete('/message/:id', auth.isAuthenticated(), controller.destroyMessage);
router.delete('/way/:id', auth.isAuthenticated(), controller.destroyWay);

module.exports = router;
