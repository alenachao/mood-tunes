/* Route related to storing/querying tracks in/from database */

const express = require("express");
const { getDatabase } = require('../db');

const router = express.Router();

// Store date-track object into collection corresponding to user's SpotifyID
// also store valence in track object to be used for analysis
router.post("/store", async (req, res) => {
    const { date, selectedTrack } = req.body;

    const [idResponse, tokenResponse] = await Promise.all([
        fetch('http://localhost:8080/api/auth/id'),
        fetch('http://localhost:8080/api/auth/token')
    ]);
    
    const { spotifyID } = await idResponse.json();
    const { token } = await tokenResponse.json();

    var parameters = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }
    const valenceResponse = await fetch('https://api.spotify.com/v1/audio-features/' + selectedTrack.id, parameters);
    const { valence } = await valenceResponse.json();
    selectedTrack.valence = valence 

    const db = getDatabase();
    const trackCollection = db.collection(spotifyID); // there is a song collection for each user based on their spotifyid
    await trackCollection.updateOne(
        { date },
        {
            $set: {
                track: selectedTrack
            }
        },
        { upsert: true }
    );
    res.json({ message: 'Track stored in the database.' });
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