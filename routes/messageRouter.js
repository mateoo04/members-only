const { Router } = require('express');
const {
  messagePost,
  messageGet,
  messageDelete,
} = require('../controllers/messageController');
const { isAuth } = require('../middlewares/authMiddleware');

const messageRouter = Router();

messageRouter.get('/', isAuth, messageGet);

messageRouter.get('/new', isAuth, (req, res, next) =>
  res.render('new-message')
);

messageRouter.delete('/:id/delete', isAuth, messageDelete);

messageRouter.post('/save', isAuth, messagePost);

module.exports = messageRouter;
