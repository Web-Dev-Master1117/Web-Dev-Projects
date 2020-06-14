const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

let artistId, seriesId;


db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Artist'", (error, table) => {
  if (error) {
    throw new Error(error);
  }

  if (table) {
    db.serialize(function() {
      db.run("INSERT INTO Artist (name, date_of_birth, biography) VALUES ('Stan Lee', 'December 28, 1922', 'I definitely work here')");
      db.run("INSERT INTO Artist (name, date_of_birth, biography) VALUES ('Jack Kirby', 'August 28, 1917', 'I also definitely work here')", function(error) {
        if (error) {
          throw new Error(error);
        }

        artistId = this.lastID;
      });

      db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Series'", (error, table) => {
        if (error) {
          throw new Error(error);
        }

        if (table) {
          db.serialize(function() {
            db.run("INSERT INTO Series (name, description) VALUES ('Pyder Man', 'A web-slinging snake slithers through Queens cleaning the streets of bad data')");
            db.run("INSERT INTO Series (name, description) VALUES ('BashMan', 'An orphaned superhero learns the power of taking commands from others and performing them exactly as expected')", function(error) {
              if (error) {
                throw new Error(error);
              }

              seriesId = this.lastID;
            });
            db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Issue'", (error, table) => {
              if (error) {
                throw new Error(error);
              }

              if (table) {
                db.serialize(function() {
                  db.run(`INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id) VALUES ('The Customizable BashMan', 1, 'January 1, 1990', ${artistId}, ${seriesId})`);
                  db.run(`INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id) VALUES ('BashMan Meets ScareCurl', 2, 'January 8, 1990', ${artistId}, ${seriesId})`);
                });
              }
            });
          });
        }
      });
    });
  }
});

