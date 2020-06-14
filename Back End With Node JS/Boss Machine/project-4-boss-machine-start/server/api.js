const express = require('express');
const apiRouter = express.Router();

const minionsRouter = require('./minions');
apiRouter.use('/minions', minionsRouter);

const ideasRouter = require('./ideas');
apiRouter.use('/ideas', ideasRouter);

const meetingsRouter = require('./meetings');
apiRouter.use('/meetings', meetingsRouter);

module.exports = apiRouter;
