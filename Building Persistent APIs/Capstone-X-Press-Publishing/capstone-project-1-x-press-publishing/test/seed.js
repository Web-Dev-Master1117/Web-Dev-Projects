const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./test/test.sqlite');

function seedArtistDatabase(done) {
  db.serialize(function() {
    db.run('DROP TABLE IF EXISTS Artist');
    db.run('CREATE TABLE `Artist` ( ' +
               '`id` INTEGER NOT NULL, ' +
               '`name` TEXT NOT NULL, ' +
               '`date_of_birth` TEXT NOT NULL, ' +
               '`biography` TEXT NOT NULL, ' +
               '`is_currently_employed` INTEGER NOT NULL DEFAULT 1, ' +
               'PRIMARY KEY(`id`) )');
    db.run("INSERT INTO Artist (id, name, date_of_birth, biography) VALUES (1, 'Artist 1', 'January 1 1980', 'I work here')");
    db.run("INSERT INTO Artist (id, name, date_of_birth, biography) VALUES (2, 'Artist 2', 'January 2 1980', 'I also work here')");
    db.run("INSERT INTO Artist (id, name, date_of_birth, biography, is_currently_employed) VALUES (3, 'Artist 3', 'January 3 1980', 'I do not work here', 0)", done);
  });
}

function seedSeriesDatabase(done) {
  db.serialize(function() {
    db.run('DROP TABLE IF EXISTS Series');
    db.run('CREATE TABLE `Series` ( ' +
               '`id` INTEGER NOT NULL, ' +
               '`name` TEXT NOT NULL, ' +
               '`description` TEXT NOT NULL, ' +
               'PRIMARY KEY(`id`) )');
    db.run("INSERT INTO Series (id, name, description) VALUES (1, 'Series 1', 'This is Series 1')");
    db.run("INSERT INTO Series (id, name, description) VALUES (2, 'Series 2', 'This is Series 2')");
    db.run("INSERT INTO Series (id, name, description) VALUES (3, 'Series 3', 'This is Series 3')", done);
  });
}

function seedIssueDatabase(done) {
  db.serialize(function() {
    db.run('DROP TABLE IF EXISTS Issue');
    db.run('CREATE TABLE `Issue` ( ' +
               '`id` INTEGER NOT NULL, ' +
               '`name` TEXT NOT NULL, ' +
               '`issue_number` INTEGER NOT NULL, ' +
               '`publication_date` TEXT NOT NULL, ' +
               '`artist_id` INTEGER NOT NULL, ' +
               '`series_id` INTEGER NOT NULL, ' +
               'PRIMARY KEY(`id`) ' +
               'FOREIGN KEY(`artist_id`) REFERENCES `Artist`(`id`) ' +
               'FOREIGN KEY(`series_id`) REFERENCES `Series`(`id`) )');
    db.run("INSERT INTO Issue (id, name, issue_number, publication_date, artist_id, series_id) VALUES (1, 'Series 2 Issue 1', 1, 'January 1, 1990', 1, 2)");
    db.run("INSERT INTO Issue (id, name, issue_number, publication_date, artist_id, series_id) VALUES (2, 'Series 2 Issue 2', 2, 'January 2, 1990', 1, 2)");
    db.run("INSERT INTO Issue (id, name, issue_number, publication_date, artist_id, series_id) VALUES (3, 'Series 3 Issue 1', 1, 'January 3, 1990', 1, 3)", done);
  });
}

module.exports = {
  seedArtistDatabase: seedArtistDatabase,
  seedSeriesDatabase: seedSeriesDatabase,
  seedIssueDatabase: seedIssueDatabase
};