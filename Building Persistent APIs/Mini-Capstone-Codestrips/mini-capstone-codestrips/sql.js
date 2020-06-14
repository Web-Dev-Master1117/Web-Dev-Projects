const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db.sqlite');

db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS Strip`);
  db.run(`CREATE TABLE IF NOT EXISTS Strip(
    id INTEGER PRIMARY KEY,
    head TEXT NOT NULL,
    body TEXT NOT NULL,
    background TEXT NOT NULL,
    bubble_type TEXT NOT NULL,
    bubble_text TEXT NOT NULL DEFAULT "",
    caption TEXT NOT NULL DEFAULT ""
  );`);
});
