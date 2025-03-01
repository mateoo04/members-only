const path = require('node:path');
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
require('./config/passport');
require('dotenv').config();

const indexRouter = require('./routes/indexRouter');
const authRouter = require('./routes/authRouter');
const passport = require('passport');
const { pool } = require('./config/db');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new pgSession({ pool, tableName: 'session' }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' },
  })
);

app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

app.use('/', indexRouter);
app.use('/', authRouter);

app.listen(3000, () => console.log('app listening on port 3000!'));
