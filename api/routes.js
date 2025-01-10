'use strict';

var controller = require('./controller');
var authValidation = require('./services/auth');

module.exports = function(app) {

    app.route('/api/v1/auth/signup').post(controller.signup);

    app.route('/api/v1/auth/login').post(controller.login);

    app.route('/api/v1/getRecommendedAttractions').post(authValidation, controller.recommendedAttractions );

    app.route('/api/v1/getRecommendedAncillaries').post(authValidation, controller.recommendedAncillaries);

    app.route('/api/v1/fetchSupportedSSRFlags').get(authValidation, controller.supportedSSRflags);

};