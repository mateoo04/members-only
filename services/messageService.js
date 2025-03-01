const { pool } = require('../config/db');
const Message = require('../models/message');

async function createMessage(message) {
  return await pool.query(
    `INSERT INTO message (member_id, title, content) VALUES($1, $2, $3)`,
    [message.memberId, message.title, message.content]
  );
}

async function getAllMessages() {
  const { rows } = await pool.query(`SELECT * FROM message`);
  return rows.map(
    (message) =>
      new Message({
        id: message.id,
        memberId: message.member_id,
        title: message.title,
        content: message.content,
        time: message.time,
      })
  );
}

module.exports = { createMessage, getAllMessages };
