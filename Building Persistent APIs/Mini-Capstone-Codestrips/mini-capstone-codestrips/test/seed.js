const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./test/test.sqlite');

module.exports =  (done) => {
  db.serialize(function() {
    db.run(`DROP TABLE IF EXISTS Strip`);
    db.run(`CREATE TABLE IF NOT EXISTS Strip(
      id INTEGER PRIMARY KEY,
      head TEXT NOT NULL,
      body TEXT NOT NULL,
      background TEXT NOT NULL,
      bubble_type TEXT NOT NULL,
      bubble_text TEXT NOT NULL,
      caption TEXT NOT NULL
    );`);
    db.run("INSERT INTO Strip (head, body, bubble_type, background, bubble_text, caption) VALUES ('angry', 'plus', 'statement', 'boat', 'test1', 'testcaption1')");
    db.run("INSERT INTO Strip (head, body, bubble_type, background, bubble_text, caption) VALUES ('angry', 'plus', 'statement', 'boat', 'test2', 'testcaption2')");
    db.run("INSERT INTO Strip (head, body, bubble_type, background, bubble_text, caption) VALUES ('angry', 'plus', 'statement', 'boat', 'test3', 'testcaption3')", done);
  });
}