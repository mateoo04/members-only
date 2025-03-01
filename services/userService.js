const { pool } = require('../config/db');
const Member = require('../models/member');

async function createUser(user) {
  return await pool.query(
    `INSERT INTO clubhouse_member (first_name, last_name, username, password, is_exclusive, is_admin)
              VALUES($1, $2, $3, $4, $5, $6) ON CONFLICT(username) DO NOTHING RETURNING *`,
    [
      user.firstName,
      user.lastName,
      user.username,
      user.password,
      user.isExclusive || false,
      user.isAdmin || false,
    ]
  );
}

async function getUserByUsername(username) {
  const { rows } = await pool.query(
    'SELECT * FROM clubhouse_member WHERE username = $1',
    [username]
  );

  if (!rows.length) return null;

  return new Member({
    ...rows.at(0),
    firstName: rows.at(0).first_name,
    lastName: rows.at(0).last_name,
    isExclusive: rows.at(0).is_exclusive,
    isAdmin: rows.at(0).is_admin,
  });
}

async function getUserById(id) {
  const { rows } = await pool.query(
    'SELECT * FROM clubhouse_member WHERE id = $1',
    [id]
  );

  if (!rows.length) return null;

  return new Member({
    ...rows.at(0),
    firstName: rows.at(0).first_name,
    lastName: rows.at(0).last_name,
    isExclusive: rows.at(0).is_exclusive,
    isAdmin: rows.at(0).is_admin,
  });
}

async function updateStatus(user) {
  await pool.query(
    `UPDATE clubhouse_member SET is_exclusive = $1, is_admin = $2 WHERE id = $3`,
    [user.isExclusive, user.isAdmin, user.id]
  );
}

module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  updateStatus,
};
