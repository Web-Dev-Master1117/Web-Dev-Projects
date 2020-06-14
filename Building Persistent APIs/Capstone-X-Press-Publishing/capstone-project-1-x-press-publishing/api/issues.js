const express = require('express');
const issuesRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

issuesRouter.param('issueId', (req, res, next, issueId) => {
    const sql = `SELECT * FROM Issue WHERE Issue.id = ${issueId}`;
    db.get(sql, (error, issue) => {
        if(error) next(error);
        else {
            if(!issue) {
                return res.sendStatus(404);
            }
            next();
        }
    })
})

issuesRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM Issue WHERE Issue.series_id = $seriesId', { $seriesId: req.params.seriesId }, (error, issues) => {
        if(error) {
            next(error);
        }
        else {
            res.status(200).json({issues: issues});
        }
    });
});

issuesRouter.post('/', (req, res, next) => {
    let name = req.body.issue.name, issueNumber = req.body.issue.issueNumber;
    let publicationDate = req.body.issue.publicationDate, artistId = req.body.issue.artistId;
    let seriesId = req.params.seriesId;
    if(!name || !issueNumber || !publicationDate || !artistId || !seriesId) {
        return res.sendStatus(400);
    }
    db.get(`SELECT * FROM Artist WHERE Artist.id = ${artistId}`, (error, artist) => {
        if(error) next(error);
        else {
            if(!artist){
                res.sendStatus(400);
            }
            else {
                const sql = 'INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id) ' +
                'VALUES ($name, $issueNumber, $publicationDate, $artistId, $seriesId)';
                const values = {
                    $name: name,
                    $issueNumber: issueNumber,
                    $publicationDate: publicationDate,
                    $artistId: artistId,
                    $seriesId: seriesId
                };
                db.run(sql, values, function(error) {
                    if(error) next(error);
                    else {
                        db.get(`SELECT * FROM Issue WHERE Issue.id = ${this.lastID}`, (error, issue) => {
                            if(error) next(error);
                            else {
                                res.status(201).json({issue: issue});
                            }
                        });
                    }
                });
            }
        }
    });
});

issuesRouter.put('/:issueId', (req, res, next) => {
    let issue = req.body.issue;
    let name = issue.name, issueNumber = issue.issueNumber;
    let publicationDate = issue.publicationDate, artistId = issue.artistId;
    if(!name || !issueNumber || !publicationDate || !artistId) {
        return res.sendStatus(400);
    }
    db.get(`SELECT * FROM Artist WHERE Artist.id = ${artistId}`, (error, artist) => {
        if(error) next(error);
        else {
            if(!artist)
                return res.sendStatus(400);
            const sql = 'UPDATE Issue SET name = $name, issue_number = $issueNumber, publication_date = $publicationDate, artist_id = $artistId WHERE Issue.id = $issueId';
            const values = {
                $name: name,
                $issueNumber: issueNumber,
                $publicationDate: publicationDate,
                $artistId: artistId,
                $issueId: req.params.issueId 
            };
            db.run(sql, values, function(error) {
                if(error) next(error);
                else {
                    db.get(`SELECT * FROM Issue WHERE id = ${req.params.issueId}`, (err, issue) => {
                        if(err) next(err);
                        else{
                            if(!issue) return res.sendStatus(400);
                            res.status(200).json({issue: issue});
                        }
                    });
                }
            });
        }
    });
});

issuesRouter.delete('/:issueId', (req, res, next) => {
    const sql = `DELETE FROM Issue WHERE Issue.id = ${req.params.issueId}`;
    db.run(sql, (error) => {
        if(error) next(error);
        else {
            res.sendStatus(204);
        }
    })
});

module.exports = issuesRouter;