const { Router } = require('express');
const { messagePost, messageGet } = require('../controllers/messageController');
const { isAuth } = require('../middlewares/authMiddleware');

const messageRouter = Router();

messageRouter.get('/', isAuth, messageGet);

messageRouter.get('/new', isAuth, (req, res, next) =>
  res.render('new-message')
);

messageRouter.post('/save', messagePost);

module.exports = messageRouter;
