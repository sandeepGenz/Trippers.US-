'use strict';

var signup = require('./services/signup');
var recommendedAttractions = require('./services/recommendedAttractions');
var recommendedAncillaries = require('./services/recommendedAncillaries');
var supportedSSRflags = require('./services/supportedSSRflags');
var login = require('./services/login');

var controllers = { 
  signup: signup, 
  login: login,
  recommendedAttractions: recommendedAttractions,
  recommendedAncillaries: recommendedAncillaries,
  supportedSSRflags: supportedSSRflags
};

module.exports = controllers;