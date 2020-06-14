const express = require('express');
const parse = require('csv-parse');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const fs = require('fs');
const {createCountryTable, createGoldMedalTable, goldMedalNumber, bestYear, mostSummerWins, mostWinterWins, bestDiscipline, bestSport, bestEvent, numberMenMedalists, numberWomenMedalists, mostMedaledAthlete, orderedMedals, orderedSports} = require('./sql');

const db = new sqlite3.Database('./gold_medals.sqlite');

const app = express();
app.use(cors());

const lowerCaseObjectKeys = (questionableKeys) => {
  // Valid SQL commands are case-insensitive, but JavaScript is case-sensitive
  let lowerCaseKeys = {};
  for (const prop in questionableKeys) {
    if (prop.toLowerCase().indexOf('count') !== -1) {
      lowerCaseKeys.count = questionableKeys[prop];
    } else {
      lowerCaseKeys[prop.toLowerCase()] = questionableKeys[prop];
    }
  }
  return lowerCaseKeys;
};

const fixCountryName = countryName => {
  // Fixes case for country names
  return countryName.replace(/\w\S*/g, txt => {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

app.get('/country/:countryName', (req, res, next) => {
  const countryName = fixCountryName(req.params.countryName);

  const goldMedalQuery = goldMedalNumber(countryName);
  const summerWinsQuery = mostSummerWins(countryName);
  const winterWinsQuery = mostWinterWins(countryName);
  const disciplineQuery = bestDiscipline(countryName); 
  const sportQuery = bestSport(countryName);
  const eventQuery = bestEvent(countryName);
  const menMedalistsQuery = numberMenMedalists(countryName);
  const womenMedalistsQuery = numberWomenMedalists(countryName);
  const yearQuery = bestYear(countryName);
  const mostMedalsQuery = mostMedaledAthlete(countryName);
  
  let country = {'name': countryName};
  db.serialize(() => {
    db.parallelize(() => {
      // Add population & gdp
      db.get("SELECT * FROM Country WHERE name = $name", {$name: countryName}, (err, row) => {
        if (err) {
          console.log(`Error while finding country details for ${countryName}.`);
          console.log(err);
        }
        if (row) {
          country.gdp = row.gdp;
          country.population = row.population;
        } else {
          country.gdp = '-';
          country.population = '-';
        }
      });

      // Add # of gold medals
      db.get(goldMedalQuery, (err, row) => {
        if (err) {
          console.log(`Error while finding number of gold medals for ${countryName}.`);
          console.log(err);
        }
        if (row) {
          const lowerRow = lowerCaseObjectKeys(row);
          country.numberMedals = lowerRow.count;
        } else {
          country.numberMedals = '-';
        }
      });

      // Add # of gold medals
      db.get(yearQuery, (err, row) => {
        if (err) {
          console.log(`Error while finding the best year for ${countryName}.`);
          console.log(err);
        }
        if (row) {
          const lowerRow = lowerCaseObjectKeys(row);
          const yearString = `${lowerRow.year} (${lowerRow.count} awards)`;
          country.bestYear = yearString;
        } else {
          country.bestYear = '-';
        }
      });

      // Add summer wins
      db.get(summerWinsQuery, (err, row) => {
        if (err) {
          console.log(`Error while finding summer wins for ${countryName}.`);
          console.log(err);
        }
        if (row) {
          const lowerRow = lowerCaseObjectKeys(row);
          const summerString = `${lowerRow.year} (${lowerRow.count} medals)`;
          country.bestSummer = summerString;
        } else {
          country.bestSummer = '-';
        }
      });

      // Add winter wins
      db.get(winterWinsQuery, (err, row) => {
        if (err) {
          console.log(`Error while finding winter wins for ${countryName}.`);
          console.log(err);
        }
        const lowerRow = lowerCaseObjectKeys(row);
        if (row) {
          const winterString = `${lowerRow.year} (${lowerRow.count} medals)`;
          country.bestWinter = winterString;
        } else {
          country.bestWinter = '-';
        }
      });

      // Add best discipline
      db.get(disciplineQuery, (err, row) => {
        if (err) {
          console.log(`Error while finding best discipline for ${countryName}.`);
          console.log(err);
        }
        if (row) {
          const lowerRow = lowerCaseObjectKeys(row);
          const disciplineString = `${lowerRow.discipline} (${lowerRow.count} medals)`;
          country.bestDiscipline = disciplineString;
        } else {
          country.bestDiscipline = '-';
        }
      });

      // Add best sport
      db.get(sportQuery, (err, row) => {
        if (err) {
          console.log(`Error while finding best sport for ${countryName}.`);
          console.log(err);
        }
        if (row) {
          const lowerRow = lowerCaseObjectKeys(row);
          const sportString = `${lowerRow.sport} (${lowerRow.count} medals)`;
          country.bestSport = sportString;
        } else {
          country.bestSport = '-';
        }
      });

      // Add best event
      db.get(eventQuery, (err, row) => {
        if (err) {
          console.log(`Error while finding best event for ${countryName}.`);
          console.log(err);
        }
        if (row) {
          const lowerRow = lowerCaseObjectKeys(row);
          const eventString = `${lowerRow.event} (${lowerRow.count} medals)`;
          country.bestEvent = eventString;
        } else {
          country.bestEvent = '-';
        }
      });

      // Add men medalists
      db.get(menMedalistsQuery, (err, row) => {
        if (err) {
          console.log(`Error while finding men medalists for ${countryName}.`);
          console.log(err);
        }
        if (row) {
          const lowerRow = lowerCaseObjectKeys(row);
          country.maleMedalists = lowerRow.count;
        } else {
          country.maleMedalists = '-';
        }
      });

      // Add women medalists
      db.get(womenMedalistsQuery, (err, row) => {
        if (err) {
          console.log(`Error while finding women medalists for ${countryName}.`);
          console.log(err);
        }
        if (row) {
          const lowerRow = lowerCaseObjectKeys(row);
          country.femaleMedalists = lowerRow.count;
        } else {
          country.femaleMedalists = '-';
        }
      });

      // Add most decorated
      db.get(mostMedalsQuery, (err, row) => {
        if (err) {
          console.log(`Error while finding women medalists for ${countryName}.`);
          console.log(err);
        }
        if (row) {
          const lowerRow = lowerCaseObjectKeys(row);
          country.mostMedalsAthlete = lowerRow.name;
        } else {
          country.mostMedalsAthlete = '-';
        }
      });
    });
    db.get("SELECT * FROM GoldMedal LIMIT 1;", (err, row) => {
      res.json(country);
    });
  });
});

app.get('/country', (req, res, next) => {
  const sortBy = req.query.sort_by;
  const isDescending = req.query.ascending === 'y';
  let dbQuery = "SELECT name, gdp, population FROM Country;";
  if (['name', 'gdp', 'population'].includes(sortBy) && typeof req.query.ascending !== 'undefined') {
    const direction = req.query.ascending === 'y' ? 'ASC' : 'DESC';
    const sortString = `ORDER BY ${sortBy} ${direction}`;
    dbQuery = `SELECT name,gdp, population FROM Country ${sortString};`;
  }

  db.all(dbQuery, (err, rows) => {
    db.serialize(() => {
      rows.forEach(row => {
        const escapedName = row.name.replace(/'/g, '\'\'');
        const getMedalsQuery = goldMedalNumber(escapedName);
        if (getMedalsQuery) {
          db.get(getMedalsQuery, (err, medalRow) => {
            if (err) {
              console.log("Error fetching gold medals number!");
              console.log(err);
            } else {
              lowerCaseRow = lowerCaseObjectKeys(medalRow);
              row.medals = lowerCaseRow.count;
            }
          });
        } else {
          console.log("Could not fetch number of gold medals!");
        }
      });
      db.get("SELECT name FROM Country LIMIT 1;", (err, row) => {
        if (sortBy === 'medalNumber' && typeof req.query.ascending !== 'undefined') {
          if (req.query.ascending === 'y') {
            rows.sort((countryA, countryB) => {
              return countryA.medals - countryB.medals;
            });
          } else {
            rows.sort((countryA, countryB) => {
              return countryB.medals - countryA.medals;
            });
          }
        }
        res.json({countries: rows});
      });
    });
  });
});

app.get('/country/:countryName/medals', (req, res, next) => {
  const countryName = fixCountryName(req.params.countryName);
  const sortBy = req.query.sort_by;
  const isAscending = req.query.ascending === 'y';

  const orderedMedalQuery = orderedMedals(countryName, sortBy, isAscending);
  db.all(orderedMedalQuery, (err, rows) => {
    if (rows) {
      res.json({'medals': rows});
    } else {
      res.json();
    }
  });
});

const transformSport = sport => {
  const loweredSport = lowerCaseObjectKeys(sport);
  return {
    'sportName':      loweredSport.sport,
    'numberMedals':   loweredSport.count,
    'percentageWins': loweredSport.percent,
  };
};

app.get('/country/:countryName/sports', (req, res, next) => {
  const countryName = fixCountryName(req.params.countryName);
  const sortBy = req.query.sort_by;
  const isAscending = req.query.ascending === 'y';

  const sportsQuery = orderedSports(countryName, sortBy, isAscending);
  if (sportsQuery) {
    db.all(sportsQuery, (err, rows) => {
      if (err) {
        console.log("Error while fetching the sports!");
        console.log(err);
        res.send();
      } else {
        rows.forEach((row, index, allRows) => {
          allRows[index] = transformSport(row);
        });
        res.json({sports: rows});
      }
    });
  } else {
    res.send();
  }
});

app.listen(3001, () => {
  let errorThrown = false;
  db.serialize(() => {
    // Drop the tables if they exist
    db.run("DROP TABLE IF EXISTS Country;");
    db.run("DROP TABLE IF EXISTS GoldMedal;");

    const createCountryQuery = createCountryTable();
    const createGoldMedalQuery = createGoldMedalTable();

    // Create the country table
    if (createCountryQuery) {
      db.run(createCountryQuery, err => {
        if (err) {
          console.log("Error while creating the Country table!");
          console.log(err);
          return;
        }
      });
    }

    // Create the GoldMedal table
    if (createGoldMedalQuery) {
      db.run(createGoldMedalQuery, err => {
        if (err) {
          console.log("Error while creating the GoldMedal table!");
          console.log(err);
          return;
        }
      });
    }

    // Add the Country data
    db.run("DELETE FROM Country;", (err) => {
      if (err) {
        console.log("Country table not found!");
        console.log(err);
        return;
      } else {
        fs.createReadStream('data/country.csv')
        .pipe(parse({from: 2}))
        .on('data', function(csvrow) {
          db.run("INSERT INTO Country (name, code, population, gdp) VALUES ($name, $code, $population, $gdp)", {
            $name: csvrow[0],
            $code: csvrow[1],
            $population: csvrow[2],
            $gdp: csvrow[3]
          }, (err) => {
            if (err) {
              console.log("Error while inserting Country data");
              console.log(err);
              return;
            }
          });
        });
      }
    });

    // Add the GoldMedal data
    db.run("DELETE FROM GoldMedal;", (err) => {
      if (err) {
        console.log("GoldMedal table not found!");
        console.log(err);
        return;
      } else {
        let idCounter = 1;
        fs.createReadStream('data/goldmedal.csv')
        .pipe(parse({from: 2}))
        .on('data', function(csvrow) {
          db.run("INSERT INTO GoldMedal (id, year, city, sport, discipline, name, country, gender, event, season) VALUES ($id, $year, $city, $sport, $discipline, $name, $country, $gender, $event, $season)", {
            $id: idCounter,
            $year: csvrow[0],
            $city: csvrow[1],
            $sport: csvrow[2],
            $discipline: csvrow[3],
            $name: csvrow[4],
            $country: csvrow[5],
            $gender: csvrow[6],
            $event: csvrow[7],
            $season: csvrow[8]
          }, (err) => {
            if (err) {
              console.log("Error while inserting GoldMedal data");
              console.log(err);
              return;
            }
          });
          idCounter += 1;
        });
      }
    });
    db.get("SELECT name FROM GoldMedal LIMIT 1;", (err, row) => {
      console.log("Data successfully loaded");
    });
  });
});
