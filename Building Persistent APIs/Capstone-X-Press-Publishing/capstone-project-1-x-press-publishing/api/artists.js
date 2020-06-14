const express = require('express');
const artistsRouter = express.Router();
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

artistsRouter.param('artistId', (req, res, next, id) => {
    db.get(`SELECT * FROM Artist WHERE id = ${id}`, (error, artist) => {
        if(error) next(error);
        else if(artist){
            req.artist = artist;
            next();
        }
        else {
            res.sendStatus(404);
        }
    });
});

artistsRouter.get('/', (req, res, next) => {
    db.all(`SELECT * FROM Artist where is_currently_employed = 1`, (error, artists) => {
        if(error) {
            next(error);
        }
        else {
            res.status(200).json({artists: artists});
        }
    });
});

artistsRouter.get('/:artistId', (req, res, next) => {
    return res.status(200).json({artist: req.artist});
});

artistsRouter.post('/', (req, res, next) => {
    let reqBody = req.body.artist;
    let name = reqBody.name;
    let dateOfBirth = reqBody.dateOfBirth;
    let biography = reqBody.biography;
    let isCurrentlyEmployed = reqBody.isCurrentlyEmployed;
    if(!name || !dateOfBirth || !biography){
        return res.sendStatus(400);
    }
    db.run('INSERT INTO Artist (name, date_of_birth, biography) VALUES ($name, $dateOfBirth, $biography)', {
        $name: name,
        $dateOfBirth: dateOfBirth,
        $biography: biography,
    }, function(error) {
        if(error) next(error);
        else {
            db.get(`SELECT * FROM Artist WHERE Artist.id = ${this.lastID}`, (error, artist) => {
            if(error) next(error);
            else {
                res.status(201).json({artist: artist});
            }
        });
    }
    });
});

artistsRouter.put('/:artistId', (req, res, next) => {
    let sql = 'UPDATE Artist SET name = $name, date_of_birth = $dateOfBirth, biography = $biography, is_currently_employed = $isCurrentlyEmployed WHERE Artist.id = $artistId';
    let artist = req.body.artist;
    let name = artist.name;
    let dateOfBirth = artist.dateOfBirth;
    let biography = artist.biography;
    let isCurrentlyEmployed = artist.isCurrentlyEmployed === 0 ? 0 : 1;
    if(!name || !dateOfBirth || !biography){
        return res.sendStatus(400);
    }
    const values = {
        $name: name,
        $dateOfBirth: dateOfBirth,
        $biography: biography,
        $isCurrentlyEmployed: isCurrentlyEmployed,
        $artistId: req.params.artistId
    };
    db.run(sql, values, function(error) {
        if(error) next(error);
        else {
            db.get(`SELECT * FROM Artist WHERE Artist.id = ${req.params.artistId}`, (error, artist) => {
                if(error) next(error);
                else{
                    res.status(200).json({artist: artist});
                }
            })
        }
    })
});

artistsRouter.delete('/:artistId', (req, res, next) => {
    db.run(`UPDATE Artist SET is_currently_employed = 0 WHERE Artist.id = ${req.params.artistId}`, (error) => {
        if(error) next(error);
        else {
            db.get(`SELECT * FROM Artist WHERE Artist.id = ${req.params.artistId}`, (error, artist) => {
                if(error) next(error);
                else {
                    res.status(200).json({artist: artist});
                }
            })
        }
    });
});

module.exports = artistsRouter;