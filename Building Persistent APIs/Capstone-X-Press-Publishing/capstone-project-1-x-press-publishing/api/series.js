const express = require('express');
const seriesRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const issuesRouter = require('./issues');

seriesRouter.param('seriesId', (req, res, next, id) => {
    db.get(`SELECT * FROM Series WHERE id = ${id}`, (error, series) => {
        if(error) next(error);
        else if(series){
            req.series = series;
            next();
        }
        else {
            res.sendStatus(404);
        }
    });
});

seriesRouter.use('/:seriesId/issues', issuesRouter);

seriesRouter.get('/', (req, res, next) => {
    db.all(`SELECT * FROM Series`, (error, series) => {
        if(error) {
            next(error);
        }
        else {
            res.status(200).json({series: series});
        }
    });
});

seriesRouter.get('/:seriesId', (req, res, next) => {
    return res.status(200).json({series: req.series});
});

seriesRouter.post('/', (req, res, next) => {
    let series = req.body.series;
    let name = series.name, description = series.description;
    if(!name || !description) return res.sendStatus(400);
    const sql = 'INSERT INTO Series (name, description) VALUES ($name, $description)';
    const values = {
        $name: name,
        $description: description
    };
    db.run(sql, values, function(error) {
        if(error) next(error);
        else {
            db.get(`SELECT * FROM Series WHERE SerieS.id = ${this.lastID}`, (error, series) => {
                if(error) next(error);
                else {
                    res.status(201).json({series: series});
                }
            })
        }
    })
});

seriesRouter.put('/:seriesId', (req, res, next) => {
    let series = req.body.series;
    let name = series.name, description = series.description;
    if(!name || !description) return res.sendStatus(400);
    const sql = 'UPDATE Series SET name = $name, description = $description WHERE id = $seriesId';
    const values = {
        $name: name,
        $description: description,
        $seriesId: req.params.seriesId
    };
    db.run(sql, values, function(error) {
        if(error) next(error);
        else {
            db.get(`SELECT * FROM Series WHERE Series.id = ${req.params.seriesId}`, (error, series) => {
                if(error) next(error);
                else {
                    res.status(200).json({series: series});
                }
            });
        }
    });
});

seriesRouter.delete('/:seriesId', (req, res, next) => {
    db.get(`SELECT * FROM Issue WHERE series_id = ${req.params.seriesId}`, (error, issue) => {
        if(error) next(error);
        else {
            if(issue) {
                return res.sendStatus(400);
            }
            const sql = `DELETE FROM Series WHERE id = ${req.params.seriesId}`;
            db.run(sql, (error) => {
                if(error) next(error);
                else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

module.exports = seriesRouter;