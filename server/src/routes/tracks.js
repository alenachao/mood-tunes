/* Route related to storing/querying tracks in/from database */

const express = require("express");
const { getDatabase } = require('../db');

const router = express.Router();

// Store date-track object into collection corresponding to user's SpotifyID
router.post("/store", async (req, res) => {
    const response = await fetch('http://localhost:8080/api/auth/id');
    const responseBody = await response.json();
    const spotifyID = responseBody.spotifyID
    const date = req.body.date
    const track = req.body.selectedTrack

    const db = getDatabase();
    const trackCollection = db.collection(spotifyID); // there is a song collection for each user based on their spotifyid
    const dateExists = await trackCollection.findOne({ date: date });

    if (!dateExists) { // if we do not have a song for that date yet then we will add it to the collection
        await trackCollection.insertOne({ 
            date: date,
            track: track}).then(response => {
            res.json({ message: 'Track added to the database.' });
        });
    } else { // if it does exist, update the database with the new song
        await trackCollection.updateOne(
            { date: date },
            { $set: { track: track } }
        ).then(response => {
            res.json({ message: 'Track updated in the database.' });
        });
    }
});

// Retrieve track given date if it exists, null otherwise
router.get("/query", async (req, res) => {
    const response = await fetch('http://localhost:8080/api/auth/id');
    const responseBody = await response.json();
    const spotifyID = responseBody.spotifyID

    const date = req.query.q

    const db = getDatabase();
    const trackCollection = db.collection(spotifyID);
    const trackGivenDate = await trackCollection.find({ date: date }).toArray();

    if (trackGivenDate.length === 0) {
        res.json({track: null})
    } else {
        res.json({track: trackGivenDate[0].track})
    }
});

module.exports = router;