const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const passport = require('passport');
const { pool } = require('../config/db');
const User = require('../models/user');

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
  body('repeatedPassword')
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
    return res.render('sign-up-form', {
      messages: errors.array().map((error) => error.msg),
      user: req.body,
    });
  }

  try {
    const { firstName, lastName, username, password, isExclusive, isAdmin } =
      req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO clubhouse_member (first_name, last_name, username, password, is_exclusive, is_admin)
            VALUES($1, $2, $3, $4, $5, $6) ON CONFLICT(username) DO NOTHING RETURNING *`,
      [
        firstName,
        lastName,
        username,
        hashedPassword,
        isExclusive || false,
        isAdmin || false,
      ]
    );

    if (!result.rows.length) {
      res.render('sign-up-form', { messages: ['Existing username entered'] });
    } else {
      const user = new User({
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

module.exports = { signUp, validateSignUp };
