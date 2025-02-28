const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { pool } = require('./db');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM clubhouse_member WHERE username = $1',
        [username]
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (err) {
      done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM clubhouse_member WHERE id = $1',
      [id]
    );
    const user = new User({
      ...rows.at(0),
      firstName: rows.at(0).first_name,
      lastName: rows.at(0).last_name,
      isExclusive: rows.at(0).is_exclusive,
      isAdmin: rows.at(0).is_admin,
    });

    done(null, user);
  } catch (err) {
    done(err);
  }
});
