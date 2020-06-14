const express = require('express');
const  {
    getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    updateInstanceInDatabase,
    deleteFromDatabasebyId
  } = require('./db');

const minionsRouter = express.Router();

//  extract minionId parameter
minionsRouter.param('minionId', (req, res, next, minionId) => {
    let minion = getFromDatabaseById('minions', minionId);
    if(minion) {
        req.minionId = minionId;
        req.minion = minion;
        next();
    }
    else{
        res.sendStatus(404);
    }
});

//  GET /api/minions to get an array of all minions
minionsRouter.get('/', (req, res, next) => {
    res.send(getAllFromDatabase('minions'));
});

//  POST /api/minions to create a new minion and save it to the database
minionsRouter.post('/', (req, res, next) => {
    let newMinion = addToDatabase('minions', req.body);
    if(newMinion) {
        res.status(201).send(newMinion);
    }
    else {
        res.sendStatus(400);
    }
});

//  GET /api/minions/:minionId to get a single minion by id
minionsRouter.get('/:minionId', (req, res, next) => {
    res.send(req.minion);
});

//  PUT /api/minions/:minionId to update a single minion by id
minionsRouter.put('/:minionId', (req, res, next) => {
    let updatedMinion = updateInstanceInDatabase('minions', req.body);
    if(updatedMinion) {
        res.send(updatedMinion);
    }
    else {
        res.sendStatus(404);
    }
});

//  DELETE /api/minions/:minionId to delete a single minion by id
minionsRouter.delete('/:minionId', (req, res, next) => {
    let check = deleteFromDatabasebyId('minions', req.minionId);
    if(check) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(500);
    }
});

//  GET /api/minions/:minionId/work to get an array of all work for the specified minon
minionsRouter.get('/:minionId/work', (req, res, next) => {
    let minionId = req.params.minionId;
    let allWork = getAllFromDatabase('work');
    const minionWork = allWork.filter((work) => {
        return work.minionId === minionId;
    });
    res.send(minionWork);
});

//  POST /api/minions/:minionId/work to create a new work object and save it to the database
minionsRouter.post('/:minionId/work', (req, res, next) => {
    const minionWork = req.body;
    minionWork.minionId = req.params.minionId;
    const createdWork = addToDatabase('work', minionWork);
    res.status(201).send(createdWork);
});

minionsRouter.param('workId', (req, res, next, workId) => {
    const work = getFromDatabaseById('work', workId);
    if(work){
        req.work = work;
        next();
    }
    else{
        res.sendStatus(404);
    }
})

//PUT /api/minions/:minionId/work/:workId to update a single work by id
minionsRouter.put('/:minionId/work/:workId', (req, res, next) => {
    if(req.params.minionId === req.body.minionId) {
        const updatedWork = updateInstanceInDatabase('work', req.body);
        res.send(updatedWork);
    }
    else {
        res.sendStatus(400);
    }
});

//  DELETE /api/minions/:minionId/work/:workId to delete a single work by id.
minionsRouter.delete('/:minionId/work/:workId', (req, res, next) => {
    const check = deleteFromDatabasebyId('work', req.params.workId);
    if(check) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(500);
    }
})

module.exports = minionsRouter;
