const { pool } = require('../config/db');
const Message = require('../models/message');
const Member = require('../models/member');

async function createMessage(message) {
  return await pool.query(
    `INSERT INTO message (member_id, title, content) VALUES($1, $2, $3)`,
    [message.member.id, message.title, message.content]
  );
}

async function getAllMessages() {
  const { rows } =
    await pool.query(`SELECT message.id AS message_id, member_id, title, content, time, 
    first_name, last_name, username, is_exclusive, is_admin 
    FROM message
    JOIN clubhouse_member ON message.member_id = clubhouse_member.id`);
  return rows.map(
    (data) =>
      new Message({
        id: data.message_id,
        member: new Member({
          id: data.member_id,
          firstName: data.first_name,
          lastName: data.last_name,
          username: data.username,
          isAdmin: data.is_admin,
          isExclusive: data.is_exclusive,
        }),
        title: data.title,
        content: data.content,
        time: data.time,
      })
  );
}

async function deleteMessage(id) {
  await pool.query(`DELETE FROM message WHERE id = $1`, [id]);
}

module.exports = { createMessage, getAllMessages, deleteMessage };
