const path = require('node:path');
const express = require('express');
const session = require('express-session');
require('./config/passport');
require('dotenv').config();

const indexRouter = require('./routes/indexRouter');
const authRouter = require('./routes/authRouter');
const passport = require('passport');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
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

app.listen(4000, () => console.log('app listening on port 4000!'));
