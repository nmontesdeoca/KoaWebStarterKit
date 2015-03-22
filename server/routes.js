var router = require('koa-route'),
    controller = require('./controller');

module.exports = function (app) {
    'use strict';

    app.use(router.get('/', controller.home));

    app.use(router.get('/about', controller.about));

    app.use(router.get('/contact', controller.contact));

    app.use(router.get('/example/:message', controller.example));
};
