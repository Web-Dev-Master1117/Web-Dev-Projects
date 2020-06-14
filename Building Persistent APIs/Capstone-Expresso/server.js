const express = require('express');
const cors = require('cors');
const errorHandler = require('errorhandler');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const apiRouter = require('./api/api');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(errorHandler());
app.use(morgan('dev'));

app.use('/api', apiRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Listening at Port: ${PORT}`);
});

module.exports = app;