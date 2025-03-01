const { Router } = require('express');

const { verifyCode } = require('../controllers/userController');
const { isAuth } = require('../middlewares/authMiddleware');
const authRouter = require('../routes/authRouter');
const messageRouter = require('../routes/messageRouter');

const indexRouter = Router();

indexRouter.use('/', authRouter);

indexRouter.use('/message', messageRouter);

indexRouter.get('/join-the-club', isAuth, (req, res) =>
  res.render('code-verification')
);

indexRouter.post('/verify-secret-code', verifyCode);

indexRouter.use('/', (req, res, next) => res.redirect('/message/'));

module.exports = indexRouter;
