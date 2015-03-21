var port = process.env.PORT || '3000',
    app = require('./server/app.js');

app.listen(port);
console.log('app listening on port', port);
