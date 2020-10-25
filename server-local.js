'use strict';

const app = require('./dist/app').createApp('');

app.listen(3000, () => console.log('Local app listening on port 3000!'));