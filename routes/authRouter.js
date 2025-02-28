const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const passport = require('passport');

const { signUp, validateSignUp } = require('../controllers/authController');

const authRouter = Router();

authRouter.post('/sign-up', validateSignUp, signUp);

authRouter.post(
  '/log-in',
  [
    body('username')
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long'),
    body('password')
      .trim()
      .escape()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.render('log-in-form', {
        messages: errors.array().map((error) => error.msg),
      });

    next();
  },
  passport.authenticate('local', {
    failureRedirect: '/log-in',
    successRedirect: '/',
    failureMessage: 'Invalid username or password entered',
  })
);

module.exports = authRouter;
