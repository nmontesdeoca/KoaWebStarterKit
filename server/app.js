var koa = require('koa'),
    serve = require('koa-static'),
    route = require('./routes'),
    app = koa();

app.use(function * (next) {
    'use strict';

    var start = Date.now(),
        ms;

    yield next;
    ms = Date.now() - start;
    console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(serve(__dirname + '/../client'));

route(app);

module.exports = app;
