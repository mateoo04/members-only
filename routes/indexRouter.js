const { Router } = require('express');

const indexRouter = Router();

indexRouter.get('/', (req, res) => res.render('index'));
indexRouter.get('/sign-up', (req, res) => res.render('sign-up-form'));
indexRouter.get('/log-in', (req, res) =>
  res.render('log-in-form', { messages: [...new Set(req.session?.messages)] })
);

module.exports = indexRouter;
