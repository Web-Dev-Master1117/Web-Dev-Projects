process.env.PORT = 8081;
process.env.TEST_DATABASE = './test/test.sqlite';

const {expect, assert} = require('chai');
const request = require('supertest');
const sqlite3 = require('sqlite3');
const express = require('express');
const Structured = require('structured');
const fs = require('fs');
const code = fs.readFileSync('app.js', 'utf8');

const app = require('../app');
const seed = require('./seed.js');

const prodDb = new sqlite3.Database('./db.sqlite');
const testDb = new sqlite3.Database(process.env.TEST_DATABASE);

describe('Express server', function() {
  it('is instantiated and exported from **app.js**', function() {
    const myApp = express();
    expect(app.unlink, 'Did you export an express application with `module.exports`?').to.deep.equal(myApp.unlink);
  });

  it('listens at the correct process.env.PORT or 4001.', function() {
    const struct = function() {
      const $PORT = process.env.PORT || 4001;
      app.listen($PORT);
    }

    let isMatch = Structured.match(code, struct);
    assert.isOk(isMatch, 'Did you use `app.listen` to start your server listening at the correct port?');
  });
});

describe('Strip table', function() {
  it('should exist', function(done) {
    prodDb.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Strip'", (error, table) => {
      if (error || !table) {
        done(new Error(error && error.message || 'Strip table not found'));
      }
      if (table) {
        done();
      }
    });
  });

  it('should have head, body, bubble_type, background, bubble_text, and caption columns with appropriate data types', function(done) {
    prodDb.run("INSERT INTO Strip (head, body, bubble_type, background, bubble_text, caption) VALUES ('angry', 'plus', 'statement', 'boat', 'test text', 'test caption')", function(error) {
      if (error) {
        done(error);
      } else {
        prodDb.run(`DELETE FROM Strip WHERE Strip.id = ${this.lastID}`, () => {
          expect(this.lastID).to.exist;
          done();
        });
      }
    });
  });

  it('should have a required head column', function(done) {
    prodDb.run("INSERT INTO Strip (body, bubble_type, background, bubble_text, caption) VALUES ('plus', 'statement', 'boat', 'test text', 'test caption')", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Strip WHERE Strip.id = ${this.lastID}`, () => {
          done(new Error('Strip without head was created.'));
        });
      } else {
        done(error);
      }
    });
  });

  it('should have a required body column', function(done) {
    prodDb.run("INSERT INTO Strip (head, bubble_type, background, bubble_text, caption) VALUES ('angry', 'statement', 'boat', 'test text', 'test caption')", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Strip WHERE Strip.id = ${this.lastID}`, () => {
          done(new Error('Strip without body was created.'));
        });
      } else {
        done(error);
      }
    });
  });

  it('should have a required background column', function(done) {
    prodDb.run("INSERT INTO Strip (head, body, bubble_type, bubble_text, caption) VALUES ('angry', 'plus', 'statement', 'test text', 'test caption')", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Strip WHERE Strip.id = ${this.lastID}`, () => {
          done(new Error('Strip without background was created.'));
        });
      } else {
        done(error);
      }
    });
  });

  it('should have a required bubble_type column', function(done) {
    prodDb.run("INSERT INTO Strip (head, body, background, bubble_text, caption) VALUES ('angry', 'plus', 'boat', 'test text', 'test caption')", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Strip WHERE Strip.id = ${this.lastID}`, () => {
          done(new Error('Strip without bubble_type was created.'));
        });
      } else {
        done(error);
      }
    });
  });

  it('should have a required bubble_text column', function(done) {
    prodDb.run("INSERT INTO Strip (head, body, background, bubble_text, bubble_type, caption) VALUES ('angry', 'plus', 'boat', null, 'question', 'test caption')", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Strip WHERE Strip.id = ${this.lastID}`, () => {
          done(new Error('Strip with null bubble_text was created.'));
        });
      } else {
        done(error);
      }
    });
  });

  it('should default bubble_text column to an empty string', function(done) {
    prodDb.run("INSERT INTO Strip (head, body, background, bubble_type, caption) VALUES ('angry', 'plus', 'boat', 'question', 'test caption')", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.get(`SELECT * FROM Strip WHERE Strip.id = ${this.lastID}`, (err, row) => {
          if (err) {
            throw (err);
          } else {
            if (row) {
              expect(row.bubble_text).to.equal('');
              prodDb.run(`DELETE FROM Strip WHERE Strip.id = ${this.lastID}`, () => {
                done();
              });
            } else {
              done(new Error('Strip not created successfully'));
            }
          }
        });
      } else {
        done(error);
      }
    });
  });

  it('should default caption column to an empty string', function(done) {
    prodDb.run("INSERT INTO Strip (head, body, background, bubble_type, bubble_text) VALUES ('angry', 'plus', 'boat', 'question', 'test text')", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.get(`SELECT * FROM Strip WHERE Strip.id = ${this.lastID}`, (err, row) => {
          if (err) {
            throw (err);
          } else {
            if (row) {
              expect(row.caption).to.equal('');
              prodDb.run(`DELETE FROM Strip WHERE Strip.id = ${this.lastID}`, () => {
                done();
              });
            } else {
              done(new Error('Strip not created successfully'));
            }
          }
        });
      } else {
        done(error);
      }
    });
  });

});

describe('GET /strips route', function() {
  before(function(done) {
    seed(done);
  });

  it('should send all rows from the Strip table', function(done) {
    let testDbRows;
    testDb.all('SELECT * FROM Strip', (err, rows) => {
      if (err) {
        return done(err);
      }
      testDbRows = rows;
      request(app)
      .get('/strips')
      .then((response) => {
        expect(response.body.strips).to.deep.equal(testDbRows);
        done();
      })
      .catch(done);
    });
  });

  it('should return a 200 status code', function() {
    return request(app)
    .get('/strips')
    .then((response) => {
      expect(response.status).to.equal(200);
    });
  });
});

describe('POST /strips route', function() {
  let validStrip;
  let invalidStrip;
  beforeEach(function(done) {
    validStrip = {
      head: 'angry',
      body: 'plus',
      bubbleType: 'statement',
      background: 'boat',
      bubbleText: 'test text',
      caption: 'test caption',
    }
    seed(done);
  });

  it('should create a valid strip', function(done) {
    request(app)
      .post('/strips')
      .send({strip: validStrip})
      .then(function() {
        testDb.all('SELECT * FROM Strip', function(error, result) {
          const strip = result.find(strip => strip.caption === validStrip.caption);
          expect(strip).to.exist;
          expect(strip.id).to.exist;
          expect(strip.head).to.equal(validStrip.head);
          expect(strip.body).to.equal(validStrip.body);
          expect(strip.bubble_type).to.equal(validStrip.bubbleType);
          expect(strip.background).to.equal(validStrip.background);
          expect(strip.bubble_text).to.equal(validStrip.bubbleText);
          expect(strip.caption).to.equal(validStrip.caption);
          done();
        });
      })
      .catch(done);
  });

  it('should return the newly-created series after series creation', function() {
    return request(app)
        .post('/strips')
        .send({strip: validStrip})
        .then(function(response) {
          const createdStrip = response.body.strip;
          expect(createdStrip).to.exist;
          expect(createdStrip.id).to.exist;
          expect(createdStrip.head).to.equal(validStrip.head);
          expect(createdStrip.body).to.equal(validStrip.body);
          expect(createdStrip.bubble_type).to.equal(validStrip.bubbleType);
          expect(createdStrip.background).to.equal(validStrip.background);
          expect(createdStrip.bubble_text).to.equal(validStrip.bubbleText);
          expect(createdStrip.caption).to.equal(validStrip.caption);
        });
  });


  it('should return a 201 status code after strip creation', function() {
    return request(app)
      .post('/strips')
      .send({strip: validStrip})
      .expect(201);
  });

  it('should return a 400 status code for a strip missing a `head`', function() {
    invalidStrip = {
      body: 'plus',
      bubbleType: 'statement',
      background: 'boat',
      bubbleText: 'test text',
      caption: 'test caption',
    };

    return request(app)
      .post('/strips')
      .send({strip: invalidStrip})
      .expect(400);
  });

  it('should return a 400 status code for a strip missing a `body`', function() {
    invalidStrip = {
      head: 'angry',
      bubbleType: 'statement',
      background: 'boat',
      bubbleText: 'test text',
      caption: 'test caption',
    };

    return request(app)
      .post('/strips')
      .send({strip: invalidStrip})
      .expect(400);
  });

  it('should return a 400 status code for a strip missing a `bubble`', function() {
    invalidStrip = {
      head: 'angry',
      body: 'plus',
      background: 'boat',
      bubbleText: 'test text',
      caption: 'test caption',
    };

    return request(app)
      .post('/strips')
      .send({strip: invalidStrip})
      .expect(400);
  });

  it('should return a 400 status code for a strip missing a `background`', function() {
    invalidStrip = {
      head: 'angry',
      body: 'plus',
      bubbleType: 'statement',
      bubbleText: 'test text',
      caption: 'test caption',
    };

    return request(app)
      .post('/strips')
      .send({strip: invalidStrip})
      .expect(400);
  });

  it('should return a 500 status code it a SQLite error occurs', function(done) {
    invalidStrip = {
      head: 'angry',
      body: 'plus',
      bubbleType: 'statement',
      background: 'boat',
    }

    request(app)
    .post('/strips')
    .send({strip: invalidStrip})
    .then((response) => {
      expect(response.status).to.equal(500);
      done();
    })
    .catch(done);
  });

});