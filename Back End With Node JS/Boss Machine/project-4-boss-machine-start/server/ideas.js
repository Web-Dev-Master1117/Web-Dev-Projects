const express = require('express');
const  {
    getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    updateInstanceInDatabase,
    deleteFromDatabasebyId
  } = require('./db');

const checkMillionDollarIdea = require('./checkMillionDollarIdea');

const ideasRouter = express.Router();

//  extract ideaId parameter
ideasRouter.param('ideaId', (req, res, next, ideaId) => {
    let ideas = getFromDatabaseById('ideas', ideaId);
    if(ideas) {
        req.ideaId = ideaId;
        req.ideas = ideas;
        next();
    }
    else{
        res.sendStatus(404);
    }
})

//  GET /api/ideas to get an array of all ideas
ideasRouter.get('/', (req, res, next) => {
    let allIdeas = getAllFromDatabase('ideas');
    if(allIdeas) {
        res.send(allIdeas);
    }
    else {
        res.sendStatus(404);
    }
});

//  POST /api/ideas to create a new ideas and save it to the database
ideasRouter.post('/', checkMillionDollarIdea, (req, res, next) => {
    let newIdea = addToDatabase('ideas', req.body);
    if(newIdea) {
        res.status(201).send(newIdea);
    }
    else {
        res.sendStatus(400);
    }
});

//  GET /api/ideas/:ideaId to get a single ideas by id
ideasRouter.get('/:ideaId', (req, res, next) => {
    res.send(req.ideas);
});

//  PUT /api/ideas/:ideaId to update a single ideas by id
ideasRouter.put('/:ideaId', checkMillionDollarIdea, (req, res, next) => {
    let updatedIdea = updateInstanceInDatabase('ideas', req.body);
    if(updatedIdea) {
        res.send(updatedIdea);
    }
    else {
        res.sendStatus(404);
    }
});

//  DELETE /api/ideas/:ideaId to delete a single ideas by id
ideasRouter.delete('/:ideaId', (req, res, next) => {
    let check = deleteFromDatabasebyId('ideas', req.ideaId);
    if(check) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(500);
    }
})

module.exports = ideasRouter;