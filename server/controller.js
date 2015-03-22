var views = require('co-views'),
    render = views(__dirname + '/views', { ext: 'ejs' });

module.exports = {
    home: function * () {
        'use strict';

        this.body = yield render('index');
    },

    about: function * () {
        'use strict';

        this.body = yield render('about');
    },

    contact: function * () {
        'use strict';

        this.body = yield render('contact');
    },

    example: function * (message) {
        'use strict';

        this.body = yield render('example', { message: message });
    }
};
