const expect = require('chai').expect;
const sqlite3 = require('sqlite3');
const emptyDb = new sqlite3.Database('./test/test.sqlite');
const seededDb = new sqlite3.Database('./test/test_seed.sqlite', sqlite3.OPEN_READONLY);
const sql = require('../sql.js');

function getCount(row) {
  if (typeof row !== 'object') {
    return undefined;
  }
  for (let value in row) {
    const lowercaseValue = value.toLowerCase();
    if (lowercaseValue.includes('count')) {
      return row[value];
    }
  }
}

describe('createCountryTable', function() {
  afterEach(function(done) {
    emptyDb.run('DROP TABLE IF EXISTS Country', done);
  });

  it('a function called createCountryTable exists', function() {
    expect(sql.createCountryTable).to.exist;
    expect(typeof sql.createCountryTable).to.equal('function');
  });

  it('should return a SQL query string that creates a table called Country', function(done) {
    const query = sql.createCountryTable();
    emptyDb.run(query, () => {
      emptyDb.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Country'", (error, table) => {
        if (error || !table) {
          done(new Error(error || 'Country table not found'));
        }
        if (table) {
          done();
        }
      });
    });
  });

  it('should return a SQL query string that creates a Country table with name, code, gdp, and population columns', function(done) {
    const query = sql.createCountryTable();
    emptyDb.run(query, () => {
      emptyDb.run("INSERT INTO Country (name, code, gdp, population) VALUES ('Angola', 'ANG', 25021974, 4101.47215182964)", (error) => {
        if (error) {
          done(new Error(error));
        } else {
          done();
        }
      });
    });
  });

  it('should return a SQL query string that creates a Country table with a required name column', function(done) {
    const query = sql.createCountryTable();
    emptyDb.run(query, () => {
      emptyDb.run("INSERT INTO Country (code, gdp, population) VALUES ('ANG', 25021974, 4101.47215182964)", (error) => {
        if (error && error.toString().includes('NOT NULL constraint failed')) {
          done();
        } else {
          done(new Error(error));
        }
      });
    });
  });

  it('should return a SQL query string that creates a Country table with a required code column', function(done) {
    const query = sql.createCountryTable();
    emptyDb.run(query, () => {
      emptyDb.run("INSERT INTO Country (name, gdp, population) VALUES ('Angola', 25021974, 4101.47215182964)", (error) => {
        if (error && error.toString().includes('NOT NULL constraint failed')) {
          done();
        } else {
          done(new Error(error));
        }
      });
    });
  });

  it('should return a SQL query string that creates a Country table with non-required gdp and population columns', function(done) {
    const query = sql.createCountryTable();
    emptyDb.run(query, () => {
      emptyDb.run("INSERT INTO Country (name, code) VALUES ('Angola', 'ANG')", (error) => {
        if (error) {
          done(new Error(error));
        } else {
          done();
        }
      });
    });
  });
});

describe('createGoldMedalTable', function() {
  afterEach(function(done) {
    emptyDb.run('DROP TABLE IF EXISTS GoldMedal', done);
  });

  it('a function called createGoldMedalTable exists', function() {
    expect(sql.createGoldMedalTable).to.exist;
    expect(typeof sql.createGoldMedalTable).to.equal('function');
  });

  it('should return a SQL query string that creates a table called GoldMedal', function(done) {
    const query = sql.createGoldMedalTable();
    emptyDb.run(query, () => {
      emptyDb.get("SELECT name FROM sqlite_master WHERE type='table' AND name='GoldMedal'", (error, table) => {
        if (error || !table) {
          done(new Error(error || 'GoldMedal table not found'));
        }
        if (table) {
          done();
        }
      });
    });
  });

  it('should return a SQL query string that creates a GoldMedal table with all necessary columns', function(done) {
    const query = sql.createGoldMedalTable();
    emptyDb.run(query, () => {
      emptyDb.run("INSERT INTO GoldMedal (year, name, event, gender, sport, discipline, city, country, season) VALUES (1991, 'Mike D', '100km', 'Men', 'Running', 'Track', 'Athens', 'Greece', 'Summer')", (error) => {
        if (error) {
          done(new Error(error));
        } else {
          done();
        }
      });
    });
  });

  it('should return a SQL query string that creates a Country table with a required year column', function(done) {
    const query = sql.createGoldMedalTable();
    emptyDb.run(query, () => {
      emptyDb.run("INSERT INTO GoldMedal (name, event, gender, sport, discipline, city, country, season) VALUES ('Mike D', '100km', 'Men', 'Running', 'Track', 'Athens', 'Greece', 'Summer')", (error) => {
        if (error && error.toString().includes('NOT NULL constraint failed')) {
          done();
        } else {
          done(new Error(error));
        }
      });
    });
  });

  it('should return a SQL query string that creates a Country table with a required name column', function(done) {
    const query = sql.createGoldMedalTable();
    emptyDb.run(query, () => {
      emptyDb.run("INSERT INTO GoldMedal (year, event, gender, sport, discipline, city, country, season) VALUES (1991, '100km', 'Men', 'Running', 'Track', 'Athens', 'Greece', 'Summer')", (error) => {
        if (error && error.toString().includes('NOT NULL constraint failed')) {
          done();
        } else {
          done(new Error(error));
        }
      });
    });
  });

  it('should return a SQL query string that creates a Country table with a required event column', function(done) {
    const query = sql.createGoldMedalTable();
    emptyDb.run(query, () => {
      emptyDb.run("INSERT INTO GoldMedal (year, name, gender, sport, discipline, city, country, season) VALUES (1991, 'Mike D', 'Men', 'Running', 'Track', 'Athens', 'Greece', 'Summer')", (error) => {
        if (error && error.toString().includes('NOT NULL constraint failed')) {
          done();
        } else {
          done(new Error(error));
        }
      });
    });
  });

  it('should return a SQL query string that creates a Country table with a required gender column', function(done) {
    const query = sql.createGoldMedalTable();
    emptyDb.run(query, () => {
      emptyDb.run("INSERT INTO GoldMedal (year, name, event, sport, discipline, city, country, season) VALUES (1991, 'Mike D', '100km', 'Running', 'Track', 'Athens', 'Greece', 'Summer')", (error) => {
        if (error && error.toString().includes('NOT NULL constraint failed')) {
          done();
        } else {
          done(new Error(error));
        }
      });
    });
  });

  it('should return a SQL query string that creates a Country table with a required sport column', function(done) {
    const query = sql.createGoldMedalTable();
    emptyDb.run(query, () => {
      emptyDb.run("INSERT INTO GoldMedal (year, name, event, gender, discipline, city, country, season) VALUES (1991, 'Mike D', '100km', 'Men', 'Track', 'Athens', 'Greece', 'Summer')", (error) => {
        if (error && error.toString().includes('NOT NULL constraint failed')) {
          done();
        } else {
          done(new Error(error));
        }
      });
    });
  });

  it('should return a SQL query string that creates a Country table with a required discipline column', function(done) {
    const query = sql.createGoldMedalTable();
    emptyDb.run(query, () => {
      emptyDb.run("INSERT INTO GoldMedal (year, name, event, gender, sport, city, country, season) VALUES (1991, 'Mike D', '100km', 'Men', 'Running', 'Athens', 'Greece', 'Summer')", (error) => {
        if (error && error.toString().includes('NOT NULL constraint failed')) {
          done();
        } else {
          done(new Error(error));
        }
      });
    });
  });

  it('should return a SQL query string that creates a Country table with a required city column', function(done) {
    const query = sql.createGoldMedalTable();
    emptyDb.run(query, () => {
      emptyDb.run("INSERT INTO GoldMedal (year, name, event, gender, sport, discipline, country, season) VALUES (1991, 'Mike D', '100km', 'Men', 'Running', 'Track', 'Greece', 'Summer')", (error) => {
        if (error && error.toString().includes('NOT NULL constraint failed')) {
          done();
        } else {
          done(new Error(error));
        }
      });
    });
  });

  it('should return a SQL query string that creates a Country table with a required country column', function(done) {
    const query = sql.createGoldMedalTable();
    emptyDb.run(query, () => {
      emptyDb.run("INSERT INTO GoldMedal (year, name, event, gender, sport, discipline, city, season) VALUES (1991, 'Mike D', '100km', 'Men', 'Running', 'Track', 'Athens', 'Summer')", (error) => {
        if (error && error.toString().includes('NOT NULL constraint failed')) {
          done();
        } else {
          done(new Error(error));
        }
      });
    });
  });

  it('should return a SQL query string that creates a Country table with a required season column', function(done) {
    const query = sql.createGoldMedalTable();
    emptyDb.run(query, () => {
      emptyDb.run("INSERT INTO GoldMedal (year, name, event, gender, sport, discipline, city, country) VALUES (1991, 'Mike D', '100km', 'Men', 'Running', 'Track', 'Athens', 'Greece')", (error) => {
        if (error && error.toString().includes('NOT NULL constraint failed')) {
          done();
        } else {
          done(new Error(error));
        }
      });
    });
  });
});

describe('goldMedalNumber', function() {
  it('a function called goldMedalNumber exists', function() {
    expect(sql.goldMedalNumber).to.exist;
    expect(typeof sql.goldMedalNumber).to.equal('function');
  });

  it('should return a SQL query string that retrieves the number of gold medals won by a country', function(done) {
    const query = sql.goldMedalNumber('Greece');
    seededDb.get(query, (error, result) => {
      let count = getCount(result);
      if (count === 3) {
        done();
      } else {
        done(new Error(error || `Expected number of medals to be 3, actual value was ${count}`));
      }
    });
  });
});

describe('mostSummerWins', function() {
  it('a function called mostSummerWins exists', function() {
    expect(sql.mostSummerWins).to.exist;
    expect(typeof sql.mostSummerWins).to.equal('function');
  });

  it('should return a SQL query string that retrieves the year a country won its most summer gold medals', function(done) {
    const query = sql.mostSummerWins('Russia');
    seededDb.get(query, (error, result) => {
      let year = result && result.year;
      if (year === 1980) {
        done();
      } else {
        done(new Error(error || `Expected year to be 1980, actual value was ${year}`));
      }
    });
  });

  it('should return a SQL query string that retrieves the number of gold medals a country won in their best summer', function(done) {
    const query = sql.mostSummerWins('Russia');
    seededDb.get(query, (error, result) => {
      let count = getCount(result);
      if (count === 2) {
        done();
      } else {
        done(new Error(error || `Expected count to be 2, actual value was ${count}`));
      }
    });
  });
});

describe('mostWinterWins', function() {
  it('a function called mostWinterWins exists', function() {
    expect(sql.mostWinterWins).to.exist;
    expect(typeof sql.mostWinterWins).to.equal('function');
  });

  it('should return a SQL query string that retrieves the year a country won its most winter gold medals', function(done) {
    const query = sql.mostWinterWins('Russia');
    seededDb.get(query, (error, result) => {
      let year = result && result.year;
      if (year === 1981) {
        done();
      } else {
        done(new Error(error || `Expected year to be 1980, actual value was ${year}`));
      }
    });
  });

  it('should return a SQL query string that retrieves the number of gold medals a country won in their best winter', function(done) {
    const query = sql.mostSummerWins('Russia');
    seededDb.get(query, (error, result) => {
      let count = getCount(result);
      if (count === 2) {
        done();
      } else {
        done(new Error(error || `Expected count to be 2, actual value was ${count}`));
      }
    });
  });
});

describe('bestYear', function() {
  it('a function called bestYear exists', function() {
    expect(sql.bestYear).to.exist;
    expect(typeof sql.bestYear).to.equal('function');
  });

  it('should return a SQL query string that retrieves the year a country won the most gedals', function(done) {
    const query = sql.bestYear('Paraguay');
    seededDb.get(query, (error, result) => {
      let year = result && result.year;
      if (year === 1961) {
        done();
      } else {
        done(new Error(error || `Expected year to be 1961, actual value was ${year}`));
      }
    });
  });

  it('should return a SQL query string that retrieves the number of medals a country won in their best year', function(done) {
    const query = sql.bestYear('Paraguay');
    seededDb.get(query, (error, result) => {
      let count = getCount(result);
      if (count === 2) {
        done();
      } else {
        done(new Error(error || `Expected count to be 2, actual value was ${count}`));
      }
    });
  });
});

describe('bestDiscipline', function() {
  it('a function called bestDiscipline exists', function() {
    expect(sql.bestDiscipline).to.exist;
    expect(typeof sql.bestDiscipline).to.equal('function');
  });

  it('should return a SQL query string that retrieves the discipline a country has won the most gold medals in', function(done) {
    const query = sql.bestDiscipline('United States');
    seededDb.get(query, (error, result) => {
      let discipline = result && result.discipline;
      if (discipline === 'Jumping') {
        done();
      } else {
        done(new Error(error || `Expected discipline to be Jumping, actual value was ${discipline}`));
      }
    });
  });

  it('should return a SQL query string that retrieves the number of times a country won their best discipline', function(done) {
    const query = sql.bestDiscipline('United States');
    seededDb.get(query, (error, result) => {
      let count = getCount(result);
      if (count === 2) {
        done();
      } else {
        done(new Error(error || `Expected count to be 2, actual value was ${count}`));
      }
    });
  });
});

describe('bestSport', function() {
  it('a function called bestSport exists', function() {
    expect(sql.bestSport).to.exist;
    expect(typeof sql.bestSport).to.equal('function');
  });

  it('should return a SQL query string that retrieves the sport a country has won the most gold medals in', function(done) {
    const query = sql.bestSport('United States');
    seededDb.get(query, (error, result) => {
      let sport = result && result.sport;
      if (sport === 'Equestrian') {
        done();
      } else {
        done(new Error(error || `Expected sport to be Equestrian, actual value was ${sport}`));
      }
    });
  });

  it('should return a SQL query string that retrieves the number of times a country won their best sport', function(done) {
    const query = sql.bestSport('United States');
    seededDb.get(query, (error, result) => {
      let count = getCount(result);
      if (count === 2) {
        done();
      } else {
        done(new Error(error || `Expected count to be 2, actual value was ${count}`));
      }
    });
  });
});

describe('bestEvent', function() {
  it('a function called bestEvent exists', function() {
    expect(sql.bestEvent).to.exist;
    expect(typeof sql.bestEvent).to.equal('function');
  });

  it('should return a SQL query string that retrieves the event a country has won the most gold medals in', function(done) {
    const query = sql.bestEvent('United States');
    seededDb.get(query, (error, result) => {
      let event = result && result.event;
      if (event === 'High Jump') {
        done();
      } else {
        done(new Error(error || `Expected sport to be High Jump, actual value was ${event}`));
      }
    });
  });

  it('should return a SQL query string that retrieves the number of times a country won their best event', function(done) {
    const query = sql.bestEvent('United States');
    seededDb.get(query, (error, result) => {
      let count = getCount(result);
      if (count === 2) {
        done();
      } else {
        done(new Error(error || `Expected count to be 2, actual value was ${count}`));
      }
    });
  });
});

describe('numberMenMedalists', function() {
  it('a function called numberMenMedalists exists', function() {
    expect(sql.numberMenMedalists).to.exist;
    expect(typeof sql.numberMenMedalists).to.equal('function');
  });

  it('should return a SQL query string that retrieves the number of men who have won gold medals for a country', function(done) {
    const query = sql.numberMenMedalists('Argentina');
    seededDb.get(query, (error, result) => {
      let count = getCount(result);
      if (count === 2) {
        done();
      } else {
        done(new Error(error || `Expected number of men to be 2, actual value was ${count}`));
      }
    });
  });

  it('should return a SQL query string that does not count the same man multiple times', function(done) {
    const query = sql.numberMenMedalists('Mexico');
    seededDb.get(query, (error, result) => {
      let count = getCount(result);
      if (count === 2) {
        done();
      } else {
        done(new Error(error || `Expected number of men to be 2, actual value was ${count}`));
      }
    });
  });
});

describe('numberWomenMedalists', function() {
  it('a function called numberWomenMedalists exists', function() {
    expect(sql.numberWomenMedalists).to.exist;
    expect(typeof sql.numberWomenMedalists).to.equal('function');
  });

  it('should return a SQL query string that retrieves the number of women who have won gold medals for a country', function(done) {
    const query = sql.numberWomenMedalists('Argentina');
    seededDb.get(query, (error, result) => {
      let count = getCount(result);
      if (count === 3) {
        done();
      } else {
        done(new Error(error || `Expected number of women to be 2, actual value was ${count}`));
      }
    });
  });

  it('should return a SQL query string that does not count the same woman multiple times', function(done) {
    const query = sql.numberWomenMedalists('Mexico');
    seededDb.get(query, (error, result) => {
      let count = getCount(result);
      if (count === 2) {
        done();
      } else {
        done(new Error(error || `Expected number of women to be 2, actual value was ${count}`));
      }
    });
  });
});

describe('mostMedaledAthlete', function() {
  it('a function called mostMedaledAthlete exists', function() {
    expect(sql.mostMedaledAthlete).to.exist;
    expect(typeof sql.mostMedaledAthlete).to.equal('function');
  });

  it('should return a SQL query string that retrieves the athlete with the most gold medals for a country', function(done) {
    const query = sql.mostMedaledAthlete('Canada');
    seededDb.get(query, (error, result) => {
      let name = result && result.name;
      if (name === 'Michael Phelps') {
        done();
      } else {
        done(new Error(error || `Expected athlete to be Michael Phelps, actual value was ${name}`));
      }
    });
  });
});

describe('orderedMedals', function() {
  it('a function called orderedMedals exists', function() {
    expect(sql.orderedMedals).to.exist;
    expect(typeof sql.orderedMedals).to.equal('function');
  });

  it('should return a SQL query string that filters by a country', function(done) {
    const query = sql.orderedMedals('France');
    seededDb.all(query, (error, result) => {
      if (result.length === 2 && (result[0].name === 'Babigail C' || result[1].name === 'Babigail C')) {
        done();
      } else if (error) {
        done(new Error(error));
      } else if (result.length !== 2) {
        done(new Error(`Expected query to return 2 medals, actual number of returned medals was ${result.length}`));
      } else {
        done(new Error(`Expected returned medal athlete names to contain Babigail C, actual values were ${result[0].name} and ${result[1].name}`));
      }
    });
  });

  it('should return a SQL query string that retrieves medals optionally ordered ascending by a given field', function(done) {
    const query = sql.orderedMedals('Germany', 'name', true);
    seededDb.all(query, (error, result) => {
      if (result.length === 2 && result[0].name === 'Abigail C') {
        done();
      } else if (error) {
        done(new Error(error));
      } else if (result.length !== 2) {
        done(new Error(`Expected query to return 2 medals, actual number of returned medals was ${result.length}`));
      } else {
        done(new Error(`Expected first returned medal athlete name to be Abigail C, actual value was ${result[0].name}`));
      }
    });
  });

  it('should return a SQL query string that retrieves medals optionally ordered descending by a given field', function(done) {
    const query = sql.orderedMedals('Germany', 'name', false);
    seededDb.all(query, (error, result) => {
      if (result.length === 2 && result[0].name === 'Zabigail C') {
        done();
      } else if (error) {
        done(new Error(error));
      } else if (result.length !== 2) {
        done(new Error(`Expected query to return 2 medals, actual number of returned medals was ${result.length}`));
      } else {
        done(new Error(`Expected first returned medal athlete name to be Zabigail C, actual value was ${result[0].name}`));
      }
    });
  });
});

describe('orderedSports', function() {
  it('a function called orderedSports exists', function() {
    expect(sql.orderedSports).to.exist;
    expect(typeof sql.orderedSports).to.equal('function');
  });

  it('should return a SQL query string that filters by a country', function(done) {
    const query = sql.orderedSports('Slovenia');
    seededDb.all(query, (error, result) => {
      const resultNames = result.map(row => { return row.sport; });
      const expectedNames = ['Football', 'Zootball'];
      const resultsAreExpected = resultNames.every(name => { return expectedNames.includes(name); });
      if (result.length === 2 && resultsAreExpected) {
        done();
      } else if (error) {
        done(new Error(error));
      } else if (result.length !== 2) {
        done(new Error(`Expected query to return 2 sports, actual number of returned sports was ${result.length}`));
      } else {
        done(new Error(`Expected returned sports to contain 'Football' and 'Zootball', actual values were ${result[0].sport} and ${result[1].sport}`));
      }
    });
  });

  it('should return a SQL query string that retrieves sports optionally ordered ascending by a given field', function(done) {
    const query = sql.orderedSports('Slovenia', 'sport', true);
    seededDb.all(query, (error, result) => {
      if (result.length === 2 && result[0].sport === 'Football') {
        done();
      } else if (error) {
        done(new Error(error));
      } else if (result.length !== 2) {
        done(new Error(`Expected query to return 2 sports, actual number of returned sports was ${result.length}`));
      } else {
        done(new Error(`Expected first returned sport to be Football, actual value was ${result[0].sport}`));
      }
    });
  });

  it('should return a SQL query string that retrieves sports optionally ordered descending by a given field', function(done) {
    const query = sql.orderedSports('Slovenia', 'sport', false);
    seededDb.all(query, (error, result) => {
      if (result.length === 2 && result[0].sport === 'Zootball') {
        done();
      } else if (error) {
        done(new Error(error));
      } else if (result.length !== 2) {
        done(new Error(`Expected query to return 2 sports, actual number of returned sports was ${result.length}`));
      } else {
        done(new Error(`Expected first returned sport to be Zootball, actual value was ${result[0].sport}`));
      }
    });
  });

  it('should return a SQL query string that calculates the percentage of wins that country has in each sport', function(done) {
    const query = sql.orderedSports('Slovenia', 'sport', true);
    seededDb.all(query, (error, result) => {
      if (result.length === 2 && result[0].percent === 75) {
        done();
      } else if (error) {
        done(new Error(error));
      } else if (result.length !== 2) {
        done(new Error(`Expected query to return 2 sports, actual number of returned sports was ${result.length}`));
      } else {
        done(new Error(`Expected Football to represent 75%, actual value was ${result[0].name}%`));
      }
    });
  });
});
