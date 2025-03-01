const { Router } = require('express');
const { verifyCode } = require('../controllers/userController');

const indexRouter = Router();

indexRouter.get('/', (req, res) => res.render('index'));

indexRouter.get('/sign-up', (req, res) => res.render('sign-up'));

indexRouter.get('/log-in', (req, res) =>
  res.render('log-in', { messages: [...new Set(req.session?.messages)] })
);

indexRouter.get('/join-the-club', (req, res) =>
  res.render('code-verification')
);

indexRouter.post('/verify-secret-code', verifyCode);

module.exports = indexRouter;
