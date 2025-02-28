const { Router } = require('express');
const { signUp } = require('../controllers/authController');
const passport = require('passport');

const authRouter = Router();

authRouter.post('/sign-up', signUp);

authRouter.post(
  '/log-in',
  passport.authenticate('local', {
    failureRedirect: '/log-in',
    successRedirect: '/',
    failureMessage: 'Invalid username or password entered',
  })
);

module.exports = authRouter;
