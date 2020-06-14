const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './db.sqlite');

const PORT = process.env.PORT || 4001;

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/strips', (req, res, next) => {
  db.all('SELECT * FROM Strip', (err, rows) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send({strips: rows});
    }
  });
});

const validateStrip = (req, res, next) => {
  const stripToCreate = req.body.strip;
  if (!stripToCreate.head || !stripToCreate.body || !stripToCreate.bubbleType ||
      !stripToCreate.background) {
    return res.sendStatus(400);
  }
  next();
}

app.post('/strips', validateStrip, (req, res, next) => {
  const stripToCreate = req.body.strip;
  db.run(`INSERT INTO Strip (head, body, bubble_type, background, bubble_text,
    caption) VALUES ($head, $body, $bubbleType, $background, $bubbleText,
    $caption)`,
  {
    $head: stripToCreate.head,
    $body: stripToCreate.body,
    $bubbleType: stripToCreate.bubbleType,
    $background: stripToCreate.background,
    $bubbleText: stripToCreate.bubbleText,
    $caption: stripToCreate.caption,
  }, function(err) {
    if (err) {
      return res.sendStatus(500);
    }
    db.get(`SELECT * FROM Strip WHERE id = ${this.lastID}`, (err, row) => {
      if (!row) {
        return res.sendStatus(500);
      }
      res.status(201).send({strip: row});
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;