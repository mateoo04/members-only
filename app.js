const path = require('node:path');
const express = require('express');
require('dotenv').config();

const indexRouter = require('./routes/indexRouter');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);

app.listen(3000, () => console.log('app listening on port 3000!'));
