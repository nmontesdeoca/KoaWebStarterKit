var koa = require('koa'),
    app = koa();

app.use(function * (next) {
    'use strict';

    var start = Date.now(),
        ms;

    yield next;
    ms = Date.now() - start;
    console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(function * (next) {
    'use strict';

    this.body = 'Hello World';
    yield next;
});


module.exports = app;
