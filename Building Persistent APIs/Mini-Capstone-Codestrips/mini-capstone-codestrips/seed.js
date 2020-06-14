const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db.sqlite');

db.serialize(() => {
  db.run(`INSERT INTO Strip (head, body, background, bubble_type, bubble_text, caption)
          VALUES ('happy', 'x', 'boat', 'statement', 'Beautiful day to sail to code island',
          'A Great Day')`, (err) => {
            if (err) {
              throw err;
            }
          });
  db.run(`INSERT INTO Strip (head, body, background, bubble_type, bubble_text, caption)
          VALUES ('angry', 'plus', 'space', 'sound', 'What do aliens on the metric system say?
          Take me to your liter!', 'Cosmic Jokes')`, (err) => {
            if (err) {
              throw err;
            }
          });
  db.all('SELECT * FROM Strip', (err, rows) => {
    if (err) {
      throw err;
    }
    console.log(`Finished seeding. There are ${rows.length} rows into the Strip table.`);
  });
});