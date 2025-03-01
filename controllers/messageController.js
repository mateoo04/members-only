const {
  createMessage,
  getAllMessages,
  deleteMessage,
} = require('../services/messageService');
const Message = require('../models/message');

const { format, isToday, isThisWeek } = require('date-fns');

function formatTime(time) {
  if (isToday(time)) {
    return `Today, ${format(time, 'H:mm')}`;
  } else if (isThisWeek(time, { weekStartsOn: 1 })) {
    return format(time, `eeee, H:mm`);
  } else return format(time, `d.M.yyyy, H:mm`);
}

async function messageGet(req, res, next) {
  try {
    const messages = await getAllMessages();

    res.render('index', {
      messages: messages.map((message) => ({
        ...message,
        time: formatTime(message.time),
      })),
    });
  } catch (err) {
    next(err);
  }
}

async function messagePost(req, res, next) {
  try {
    await createMessage(
      new Message({
        member: res.locals.user,
        title: req.body.title,
        content: req.body.content,
      })
    );

    res.redirect('/');
  } catch (err) {
    next(err);
  }
}

async function messageDelete(req, res, next) {
  try {
    await deleteMessage(req.params.id);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
}

module.exports = { messagePost, messageGet, messageDelete };
