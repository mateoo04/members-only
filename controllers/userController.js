const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const Member = require('../models/member');
const { createUser, updateStatus } = require('../services/userService');

const validateSignUp = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 3 })
    .withMessage('First name must be at lest 3 characters.')
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[-' ][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/)
    .withMessage(
      'First name can only contain letters, spaces, hyphens, and apostrophes'
    )
    .escape(),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 3 })
    .withMessage('Last name must be at lest 3 characters.')
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[-' ][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/)
    .withMessage(
      'Last name can only contain letters, spaces, hyphens, and apostrophes'
    )
    .escape(),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at lest 3 characters.')
    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage('First name can only contain letters, numbers and underscores')
    .escape(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase character')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[\W]/)
    .withMessage('Password must contain at least one special character')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .escape(),
  body('confirmPassword')
    .trim()
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
    .escape(),
];

async function signUp(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('sign-up', {
      errors: errors.array().map((error) => error.msg),
      user: req.body,
    });
  }

  try {
    const { firstName, lastName, username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await createUser(
      new Member({
        firstName,
        lastName,
        username,
        password: hashedPassword,
        isExclusive: false,
        isAdmin: false,
      })
    );

    if (!result) {
      res.render('sign-up', { errors: ['Existing username entered'] });
    } else {
      const user = new Member({
        ...result.rows.at(0),
        firstName: result.rows.at(0).first_name,
        lastName: result.rows.at(0).last_name,
        isExclusive: result.rows.at(0).is_exclusive,
        isAdmin: result.rows.at(0).is_admin,
      });

      req.logIn(user, (err) => {
        if (err) return next(err);
        res.redirect('/');
      });
    }
  } catch (err) {
    next(err);
  }
}

async function verifyCode(req, res, next) {
  const code = req.body.code;

  if (code === process.env.EXCLUSIVE_CODE)
    updateStatus({ ...res.locals.user, isExclusive: true });
  else if (code === process.env.ADMIN_CODE)
    updateStatus({ ...res.locals.user, isAdmin: true, isExclusive: true });

  res.redirect('/join-the-club');
}

module.exports = { signUp, validateSignUp, verifyCode };
