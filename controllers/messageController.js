const { createMessage, getAllMessages } = require('../services/messageService');
const Message = require('../models/message');

async function messageGet(req, res, next) {
  try {
    const messages = await getAllMessages();

    res.render('index', { messages });
  } catch (err) {
    next(err);
  }
}

async function messagePost(req, res, next) {
  try {
    createMessage(
      new Message({
        memberId: res.locals.user.id,
        title: req.body.title,
        content: req.body.content,
      })
    );

    res.redirect('/');
  } catch (err) {
    next(err);
  }
}

module.exports = { messagePost, messageGet };
