const express = require('express');
const  {
    getAllFromDatabase,
    addToDatabase,
    deleteAllFromDatabase,
    createMeeting
  } = require('./db');

const meetingsRouter = express.Router();

//  GET /api/meetings to get an array of all ideas
meetingsRouter.get('/', (req, res, next) => {
    let allMeetings = getAllFromDatabase('meetings');
    if(allMeetings) {
        res.send(allMeetings);
    }
    else {
        res.sendStatus(404);
    }
});

//  POST /api/meetings to create a new meeting and save it to the database
meetingsRouter.post('/', (req, res, next) => {
    let newMeeting = addToDatabase('meetings', createMeeting());
    if(newMeeting) {
        res.status(201).send(newMeeting);
    }
    else {
        res.sendStatus(400);
    }
});

//  DELETE /api/meetings/ to delete all meetings
meetingsRouter.delete('/', (req, res, next) => {
    let check = deleteAllFromDatabase('meetings');
    if(check) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(500);
    }
})

module.exports = meetingsRouter;