process.env.PORT = 8081;
process.env.TEST_DATABASE = './test/test.sqlite';

const expect = require('chai').expect;
const request = require('supertest');
const sqlite3 = require('sqlite3');

const app = require('../server.js');
const seed = require('./seed.js');

const prodDb = new sqlite3.Database('./database.sqlite');
let testDb = new sqlite3.Database(process.env.TEST_DATABASE);

describe('Artist Table', function() {
  it('should exist', function(done) {
    prodDb.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Artist'", (error, table) => {
      if (error || !table) {
        done(new Error(error || 'Artist table not found'));
      }
      if (table) {
        done();
      }
    });
  });

  it('should have name, date_of_birth, biography, and is_currently_employed columns with appropriate data types', function(done) {
    prodDb.run("INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed) VALUES ('Artist Name', 'January 1, 1980', 'My Biography', 1)", function(error) {
      if (error) {
        done(new Error(error));
      } else {
        prodDb.run(`DELETE FROM Artist WHERE Artist.id = ${this.lastID}`, () => {
          expect(this.lastID).to.exist;
          done();
        });
      }
    });
  });

  it('should have a required name column', function(done) {
    prodDb.run("INSERT INTO Artist (date_of_birth, biography, is_currently_employed) VALUES ('January 1, 1980', 'My Biography', 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Artist WHERE Artist.id = ${this.lastID}`, () => {
          done(new Error('Artist without name was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required date_of_birth column', function(done) {
    prodDb.run("INSERT INTO Artist (name, biography, is_currently_employed) VALUES ('Artist Name', 'My Biography', 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Artist WHERE Artist.id = ${this.lastID}`, () => {
          done(new Error('Artist without date_of_birth was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required biography column', function(done) {
    prodDb.run("INSERT INTO Artist (name, date_of_birth, is_currently_employed) VALUES ('Artist Name', 'January 1, 1980', 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Artist WHERE Artist.id = ${this.lastID}`, () => {
          done(new Error('Artist without biography was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('is_currently_employed should default to 1', function(done) {
    prodDb.run("INSERT INTO Artist (name, date_of_birth, biography) VALUES ('Artist Name', 'January 1, 1980', 'My Biography')", function(error) {
      if (error) {
        done(new Error(error));
      } else {
        const artistId = this.lastID;
        prodDb.get(`SELECT * FROM Artist WHERE Artist.id = ${artistId}`, (error, artist) => {
          prodDb.run(`DELETE FROM Artist WHERE Artist.id = ${artistId}`, () => {
            expect(artist.is_currently_employed).to.equal(1);
            done();
          });
        });
      }
    });
  });
});

describe('Series Table', function() {
  it('should exist', function(done) {
    prodDb.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Series'", (error, table) => {
      if (error || !table) {
        done(new Error(error || 'Series table not found'));
      }
      if (table) {
        done();
      }
    });
  });

  it('should have id, name, and description columns with appropriate data types', function(done) {
    prodDb.run("INSERT INTO Series (name, description) VALUES ('Series Name', 'Series Description')", function(error) {
      if (error) {
        done(new Error(error));
      } else {
        prodDb.run(`DELETE FROM Series WHERE Series.id = ${this.lastID}`, () => {
          expect(this.lastID).to.exist;
          done();
        });
      }
    });
  });

  it('should have a required name column', function(done) {
    prodDb.run("INSERT INTO Series (description) VALUES ('Series Description')", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Series WHERE Series.id = ${this.lastID}`, () => {
          done(new Error('Series without name was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required description column', function(done) {
    prodDb.run("INSERT INTO Series (name) VALUES ('Series Name')", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Series WHERE Series.id = ${this.lastID}`, () => {
          done(new Error('Series without description was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });
});

describe('Issue Table', function() {
  it('should exist', function(done) {
    prodDb.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Issue'", (error, table) => {
      if (error || !table) {
        done(new Error(error || 'Issue table not found'));
      }
      if (table) {
        done();
      }
    });
  });

  it('should have id, name, issue_number, publication_date, artist_id, and series_id columns with appropriate data types', function(done) {
    prodDb.run("INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id) VALUES ('Issue Name', 1, 'January 1, 1980', 1, 1)", function(error) {
      if (error) {
        done(new Error(error));
      } else {
        prodDb.run(`DELETE FROM Issue WHERE Issue.id = ${this.lastID}`, () => {
          expect(this.lastID).to.exist;
          done();
        });
      }
    });
  });

  it('should have a required name column', function(done) {
    prodDb.run("INSERT INTO Issue (issue_number, publication_date, artist_id, series_id) VALUES (1, 'January 1, 1980', 1, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Issue WHERE Issue.id = ${this.lastID}`, () => {
          done(new Error('Issue without name was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required name column', function(done) {
    prodDb.run("INSERT INTO Issue (issue_number, publication_date, artist_id, series_id) VALUES (1, 'January 1, 1980', 1, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Issue WHERE Issue.id = ${this.lastID}`, () => {
          done(new Error('Issue without name was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required issue_number column', function(done) {
    prodDb.run("INSERT INTO Issue (name, publication_date, artist_id, series_id) VALUES ('Issue Name', 'January 1, 1980', 1, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Issue WHERE Issue.id = ${this.lastID}`, () => {
          done(new Error('Issue without issue_number was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required publication_date column', function(done) {
    prodDb.run("INSERT INTO Issue (name, issue_number, artist_id, series_id) VALUES ('Issue Name', 1, 1, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Issue WHERE Issue.id = ${this.lastID}`, () => {
          done(new Error('Issue without publication_date was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required artist_id column', function(done) {
    prodDb.run("INSERT INTO Issue (name, issue_number, publication_date, series_id) VALUES ('Issue Name', 1, 'January 1, 1980', 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Issue WHERE Issue.id = ${this.lastID}`, () => {
          done(new Error('Issue without artist_id was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required series_id column', function(done) {
    prodDb.run("INSERT INTO Issue (name, issue_number, publication_date, artist_id) VALUES ('Issue Name', 1, 'January 1, 1980', 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Issue WHERE Issue.id = ${this.lastID}`, () => {
          done(new Error('Issue without series_id was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });
});

describe('GET /api/artists', function() {
  before(function(done) {
    seed.seedArtistDatabase(done);
  });

  it('should return all currently-employed artists', function() {
    return request(app)
        .get('/api/artists')
        .then(function(response) {
          const artists = response.body.artists;
          expect(artists.length).to.equal(2);
          expect(artists.find(artist => artist.id === 1)).to.exist;
          expect(artists.find(artist => artist.id === 2)).to.exist;
          expect(artists.find(artist => artist.id === 3)).to.not.exist;
        });
  });

  it('should return a status code of 200', function() {
    return request(app)
        .get('/api/artists')
        .expect(200);
  });
});

describe('GET /api/artists/:id', function() {
  before(function(done) {
    seed.seedArtistDatabase(done);
  });

  it('should return the artist with the given ID', function() {
    return request(app)
        .get('/api/artists/2')
        .then(function(response) {
          const artist = response.body.artist;
          expect(artist.id).to.equal(2);
          expect(artist.name).to.equal('Artist 2');
          expect(artist.date_of_birth).to.equal('January 2 1980');
          expect(artist.biography).to.equal('I also work here');
          expect(artist.is_currently_employed).to.equal(1);
        });
  });

  it('should return a 200 status code for valid IDs', function() {
    return request(app)
        .get('/api/artists/2')
        .expect(200);
  });

  it('should return a 404 status code for invalid IDs', function() {
    return request(app)
        .get('/api/artists/999')
        .expect(404);
  });
});

describe('POST /api/artists', function() {
  let newArtist;

  beforeEach(function(done) {
    newArtist = {
      name: 'New Artist',
      dateOfBirth: 'February 1, 1980',
      biography: 'My Biography'
    };

    seed.seedArtistDatabase(done);
  });

  it('should create a valid artist', function(done) {
      request(app)
        .post('/api/artists/')
        .send({artist: newArtist})
        .then(function() {
          testDb.all('SELECT * FROM Artist', function(error, result) {
            if (error) {
              throw new Error(error);
            }
            const artist = result.find(artist => artist.name === newArtist.name);
            expect(artist).to.exist;
            expect(artist.id).to.exist;
            expect(artist.date_of_birth).to.equal(newArtist.dateOfBirth);
            expect(artist.biography).to.equal(newArtist.biography);
            done();
          });
        }).catch(done);
  });

  it('should return a 201 status code after artist creation', function() {
    return request(app)
        .post('/api/artists/')
        .send({artist: newArtist})
        .expect(201);
  });

  it('should return the newly-created artist after artist creation', function() {
    return request(app)
        .post('/api/artists/')
        .send({artist: newArtist})
        .then(function(response) {
          const artist = response.body.artist;
          expect(artist).to.exist;
          expect(artist.id).to.exist;
          expect(artist.name).to.equal(newArtist.name);
          expect(artist.date_of_birth).to.equal(newArtist.dateOfBirth);
          expect(artist.biography).to.equal(newArtist.biography);
        });
  });

  it('should set new artists as currently-employed by default', function() {
    return request(app)
        .post('/api/artists/')
        .send({artist: newArtist})
        .then(function(response) {
          const artist = response.body.artist;
          expect(artist.is_currently_employed).to.equal(1);
        });
  });

  it('should return a 400 status code for invalid artists', function() {
    newArtist = {
      dateOfBirth: 'February 1, 1980',
      biography: 'My Biography'
    };

    return request(app)
        .post('/api/artists/')
        .send({artist: newArtist})
        .expect(400);
  });
});

describe('PUT /api/artists/:id', function() {
  let updatedArtist;

  beforeEach(function(done) {
    updatedArtist = {
      name: 'Updated Artist',
      dateOfBirth: 'February 1, 1981',
      biography: 'My New Biography',
      isCurrentlyEmployed: 1
    };

    seed.seedArtistDatabase(done);
  });

  it('should update the artist with the given ID', function(done) {
    request(app)
        .put('/api/artists/1')
        .send({artist: updatedArtist})
        .then(function() {
          testDb.get('SELECT * FROM Artist WHERE Artist.id = 1', function(error, artist) {
            if (error) {
              throw new Error(error)
            }
            expect(artist).to.exist;
            expect(artist.id).to.equal(1);
            expect(artist.name).to.equal(updatedArtist.name);
            expect(artist.date_of_birth).to.equal(updatedArtist.dateOfBirth);
            expect(artist.biography).to.equal(updatedArtist.biography);
            expect(artist.is_currently_employed).to.equal(updatedArtist.isCurrentlyEmployed);
            done();
          });
        }).catch(done);
  });

  it('should return a 200 status code after artist update', function() {
    return request(app)
        .put('/api/artists/1')
        .send({artist: updatedArtist})
        .expect(200);
  });

  it('should return the updated artist after artist update', function() {
    return request(app)
        .put('/api/artists/1')
        .send({artist: updatedArtist})
        .then(function(response) {
          const artist = response.body.artist;
          expect(artist.id).to.equal(1);
          expect(artist.name).to.equal(updatedArtist.name);
          expect(artist.date_of_birth).to.equal(updatedArtist.dateOfBirth);
          expect(artist.biography).to.equal(updatedArtist.biography);
          expect(artist.is_currently_employed).to.equal(updatedArtist.isCurrentlyEmployed);
        });
  });

  it('should return a 400 status code for invalid artist updates', function() {
    updatedArtist = {
      dateOfBirth: 'February 1, 1981',
      biography: 'My New Biography',
      isCurrentlyEmployed: 1
    };

    return request(app)
        .put('/api/artists/1')
        .send({artist: updatedArtist})
        .expect(400);
  });
});

describe('DELETE /api/artists/:id', function() {
  beforeEach(function(done) {
    seed.seedArtistDatabase(done);
  });

  it('should set the artist with the given ID as not currently-employed', function(done) {
    request(app)
        .del('/api/artists/1')
        .then(function() {
          testDb.get('SELECT * FROM Artist WHERE Artist.id = 1', function(error, artist) {
            if (error) {
              throw new Error(error);
            }
            expect(artist).to.exist;
            expect(artist.is_currently_employed).to.equal(0);
            done();
          });
        }).catch(done);
  });

  it('should return a 200 status code after artist delete', function() {
    return request(app)
        .del('/api/artists/1')
        .expect(200);
  });

  it('should return the deleted artist after artist delete', function() {
    return request(app)
        .del('/api/artists/1')
        .then(function(response) {
          const artist = response.body.artist;
          expect(artist.id).to.equal(1);
          expect(artist.is_currently_employed).to.equal(0);
        });
  });
});

describe('GET /api/series', function() {
  before(function(done) {
    seed.seedSeriesDatabase(done);
  });

  it('should return all series', function() {
    return request(app)
        .get('/api/series')
        .then(function(response) {
          const series = response.body.series;
          expect(series.length).to.equal(3);
          expect(series.find(series => series.id === 1)).to.exist;
          expect(series.find(series => series.id === 2)).to.exist;
          expect(series.find(series => series.id === 3)).to.exist;
        });
  });

  it('should return a status code of 200', function() {
    return request(app)
        .get('/api/series')
        .expect(200);
  });
});

describe('GET /api/series/:id', function() {
  before(function(done) {
    seed.seedSeriesDatabase(done);
  });

  it('should return the series with the given ID', function() {
    return request(app)
        .get('/api/series/2')
        .then(function(response) {
          const series = response.body.series;
          expect(series.id).to.equal(2);
          expect(series.name).to.equal('Series 2');
          expect(series.description).to.equal('This is Series 2');
        });
  });

  it('should return a 200 status code for valid IDs', function() {
    return request(app)
        .get('/api/series/2')
        .expect(200);
  });

  it('should return a 404 status code for invalid IDs', function() {
    return request(app)
        .get('/api/series/999')
        .expect(404);
  });
});

describe('POST /api/series', function() {
  let newSeries;

  beforeEach(function(done) {
    newSeries = {
      name: 'New Series',
      description: 'New Description'
    };

    seed.seedSeriesDatabase(done);
  });

  it('should create a valid series', function() {
    return request(app)
        .post('/api/series/')
        .send({series: newSeries})
        .then(function() {
          testDb.all('SELECT * FROM Series', function(error, result) {
            if (error) {
              throw new Error(error);
            }
            const series = result.find(series => series.name === newSeries.name);
            expect(series).to.exist;
            expect(series.id).to.exist;
            expect(series.name).to.equal(newSeries.name);
            expect(series.description).to.equal(newSeries.description);
          });
        });
  });

  it('should return a 201 status code after series creation', function() {
    return request(app)
        .post('/api/series/')
        .send({series: newSeries})
        .expect(201);
  });

  it('should return the newly-created series after series creation', function() {
    return request(app)
        .post('/api/series/')
        .send({series: newSeries})
        .then(function(response) {
          const series = response.body.series;
          expect(series).to.exist;
          expect(series.id).to.exist;
          expect(series.name).to.equal(newSeries.name);
          expect(series.description).to.equal(newSeries.description);
        });
  });

  it('should return a 400 status code for invalid series', function() {
    newSeries = {
      name: 'New Series'
    };

    return request(app)
        .post('/api/series/')
        .send({series: newSeries})
        .expect(400);
  });
});

describe('PUT /api/series/:id', function() {
  let updatedSeries;

  beforeEach(function(done) {
    updatedSeries = {
      name: 'Updated Series',
      description: 'Updated Description'
    };

    seed.seedSeriesDatabase(done);
  });

  it('should update the series with the given ID', function(done) {
    request(app)
        .put('/api/series/1')
        .send({series: updatedSeries})
        .then(function() {
          testDb.get('SELECT * FROM Series WHERE Series.id = 1', function(error, series) {
            if (error) {
              throw new Error(error);
            }
            expect(series).to.exist;
            expect(series.id).to.equal(1);
            expect(series.name).to.equal(updatedSeries.name);
            expect(series.description).to.equal(updatedSeries.description);
            done()
          });
        }).catch(done);
  });

  it('should return a 200 status code after series update', function() {
    return request(app)
        .put('/api/series/1')
        .send({series: updatedSeries})
        .expect(200);
  });

  it('should return the updated series after series update', function() {
    return request(app)
        .put('/api/series/1')
        .send({series: updatedSeries})
        .then(function(response) {
          const series = response.body.series;
          expect(series).to.exist;
          expect(series.id).to.equal(1);
          expect(series.name).to.equal(updatedSeries.name);
          expect(series.description).to.equal(updatedSeries.description);
        });
  });

  it('should return a 400 status code for invalid series updates', function() {
    updatedSeries = {
      description: 'Updated Description'
    };

    return request(app)
        .put('/api/series/1')
        .send({series: updatedSeries})
        .expect(400);
  });
});

describe('DELETE /api/series/:id', function() {
  beforeEach(function(done) {
    seed.seedSeriesDatabase(done);
  });

  it('should remove the series with the specified ID from the database if that series has no related issues', function() {
    return request(app)
        .del('/api/series/1')
        .then(function() {
          testDb.get('SELECT * FROM Series WHERE Series.id = 1', function(error, series) {
            if (error) {
              throw new Error(error);
            }
            expect(series).not.to.exist;
          });
        });
  });

  it('should return a 204 status code after series delete', function() {
    return request(app)
        .del('/api/series/1')
        .expect(204);
  });

  it('should not delete series with existing related issues', function() {
    return request(app)
        .del('/api/series/2')
        .then(function() {
          testDb.get('SELECT * FROM Series WHERE Series.id = 2', function(error, series) {
            if (error) {
              throw new Error(error);
            }
            expect(series).to.exist;
          });
        });
  });

  it('should return a 400 status code if deleted series has existing related issues', function() {
    return request(app)
        .del('/api/series/2')
        .expect(400);
  });
});

describe('GET /api/series/:seriesId/issues', function() {
  before(function(done) {
    seed.seedIssueDatabase(done);
  });

  it('should return all issues of an existing series', function() {
    return request(app)
        .get('/api/series/2/issues')
        .then(function(response) {
          const issues = response.body.issues;
          expect(issues.length).to.equal(2);
          expect(issues.find(issue => issue.id === 1)).to.exist;
          expect(issues.find(issue => issue.id === 2)).to.exist;
        });
  });

  it('should return an empty array for existing series with no issues', function() {
    return request(app)
        .get('/api/series/1/issues')
        .then(function(response) {
          const issues = response.body.issues;
          expect(issues.length).to.equal(0);
        });
  });

  it('should return a status code of 200 for valid series', function() {
    return request(app)
        .get('/api/series/2/issues')
        .expect(200);
  });

  it('should return a status code of 404 for invalid series', function() {
    return request(app)
        .get('/api/series/999/issues')
        .expect(404);
      });
});

describe('POST /api/series/:seriesId/issues', function() {
  let newIssue;

  beforeEach(function(done) {
    newIssue = {
      name: 'New Issue',
      issueNumber: 3,
      publicationDate: 'January 3, 1990',
      artistId: 1
    };

    seed.seedIssueDatabase(done);
  });

  it('should create a valid issue', function(done) {
    request(app)
        .post('/api/series/2/issues')
        .send({issue: newIssue})
        .then(function() {
          testDb.all('SELECT * FROM Issue', function(error, result) {
            if (error) {
              throw new Error(error);
            }
            const issue = result.find(issue => issue.name === newIssue.name);
            expect(issue).to.exist;
            expect(issue.id).to.exist;
            expect(issue.name).to.equal(newIssue.name);
            expect(issue.issue_number).to.equal(newIssue.issueNumber);
            expect(issue.publication_date).to.equal(newIssue.publicationDate);
            expect(issue.artist_id).to.equal(newIssue.artistId);
            expect(issue.series_id).to.equal(2);
            done()
          });
        }).catch(done);
  });

  it('should return a 201 status code after issue creation', function() {
    return request(app)
        .post('/api/series/2/issues')
        .send({issue: newIssue})
        .expect(201);
  });

  it('should return the newly-created issue after issue creation', function() {
    return request(app)
        .post('/api/series/2/issues')
        .send({issue: newIssue})
        .then(function(response) {
          const issue = response.body.issue;
          expect(issue).to.exist;
          expect(issue.id).to.exist;
          expect(issue.name).to.equal(newIssue.name);
          expect(issue.issue_number).to.equal(newIssue.issueNumber);
          expect(issue.publication_date).to.equal(newIssue.publicationDate);
          expect(issue.artist_id).to.equal(newIssue.artistId);
          expect(issue.series_id).to.equal(2);
        });
  });

  it('should return a 400 status code for invalid issues', function() {
    newIssue = {
      issueNumber: 3,
      publicationDate: 'January 3, 1990',
      artistId: 1
    };

    return request(app)
        .post('/api/series/2/issues')
        .send({issue: newIssue})
        .expect(400);
  });

  it('should return a 400 status code if an artist with the issue\'s artist ID doesn\'t exist', function() {
    newIssue = {
      issueNumber: 3,
      publicationDate: 'January 3, 1990',
      artistId: 999
    };

    return request(app)
        .post('/api/series/2/issues')
        .send({issue: newIssue})
        .expect(400);
  });
});

describe('PUT /api/series/:seriesId/issues/:issueId', function() {
  let updatedIssue;

  beforeEach(function(done) {
    updatedIssue = {
      name: 'Updated Issue',
      issueNumber: 3,
      publicationDate: 'January 3, 1990',
      artistId: 2
    };

    seed.seedIssueDatabase(done);
  });

  it('should update the issue with the given ID', function(done) {
    request(app)
        .put('/api/series/2/issues/1')
        .send({issue: updatedIssue})
        .then(function() {
          testDb.get('SELECT * FROM Issue WHERE Issue.id = 1', function(error, issue) {
            if (error) {
              throw new Error(error);
            }
            expect(issue).to.exist;
            expect(issue.id).to.equal(1);
            expect(issue.name).to.equal(updatedIssue.name);
            expect(issue.issue_number).to.equal(updatedIssue.issueNumber);
            expect(issue.publication_date).to.equal(updatedIssue.publicationDate);
            expect(issue.artist_id).to.equal(updatedIssue.artistId);
            expect(issue.series_id).to.equal(2);
            done();
          });
        }).catch(done);
  });

  it('should return a 200 status code after issue update', function() {
    return request(app)
        .put('/api/series/2/issues/1')
        .send({issue: updatedIssue})
        .expect(200);
  });

  it('should return the updated issue after issue update', function() {
    return request(app)
        .put('/api/series/2/issues/1')
        .send({issue: updatedIssue})
        .then(function(response) {
          const issue = response.body.issue;
          expect(issue).to.exist;
          expect(issue.id).to.equal(1);
          expect(issue.name).to.equal(updatedIssue.name);
          expect(issue.issue_number).to.equal(updatedIssue.issueNumber);
          expect(issue.publication_date).to.equal(updatedIssue.publicationDate);
          expect(issue.artist_id).to.equal(updatedIssue.artistId);
          expect(issue.series_id).to.equal(2);
        });
  });

  it('should return a 404 status code for invalid issue IDs', function() {
    updatedIssue = {
      issueNumber: 3,
      publicationDate: 'January 3, 1990',
      artistId: 2
    };

    return request(app)
        .put('/api/series/2/issues/999')
        .send({issue: updatedIssue})
        .expect(404);
  });

  it('should return a 400 status code for invalid issue updates', function() {
    updatedIssue = {
      issueNumber: 3,
      publicationDate: 'January 3, 1990',
      artistId: 2
    };

    return request(app)
        .put('/api/series/2/issues/1')
        .send({issue: updatedIssue})
        .expect(400);
  });

  it('should return a 400 status code if an artist with the updated artist ID doesn\'t exist', function() {
    updatedIssue = {
      issueNumber: 3,
      publicationDate: 'January 3, 1990',
      artistId: 999
    };

    return request(app)
        .put('/api/series/2/issues/1')
        .send({issue: updatedIssue})
        .expect(400);
  });
});

describe('DELETE /api/series/:seriesId/issues/:issueId', function() {
  beforeEach(function(done) {
    seed.seedIssueDatabase(done);
  });

  it('should remove the issue with the specified ID from the database', function(done) {
    request(app)
        .del('/api/series/2/issues/1')
        .then(function() {
          testDb.get('SELECT * FROM Issue WHERE Issue.id = 1', function(error, issue) {
            if (error) {
              throw new Error(error);
            }
            expect(issue).not.to.exist;
            done();
          });
        }).catch(done);
  });

  it('should return a 204 status code after issue delete', function() {
    return request(app)
        .del('/api/series/2/issues/1')
        .expect(204);
  });

  it('should return a 404 status code for invalid issue IDs', function() {
    return request(app)
        .del('/api/series/2/issues/999')
        .expect(404);
  });
});