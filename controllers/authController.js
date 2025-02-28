const bcrypt = require('bcryptjs');
const passport = require('passport');
const { pool } = require('../config/db');
const User = require('../models/user');

async function signUp(req, res, next) {
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
      res.render('sign-up-form', { message: 'Existing username entered' });
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

module.exports = { signUp };
