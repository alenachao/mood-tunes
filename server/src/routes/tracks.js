/* Route related to storing/querying/using tracks in/from database */

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
    const { access_token } = await tokenResponse.json();

    var parameters = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token
        }
    }
    const valenceResponse = await fetch('https://api.spotify.com/v1/audio-features/' + selectedTrack.id, parameters);
    // console.log(valenceResponse)
    const { valence } = await valenceResponse.json();
    selectedTrack.valence = valence; 

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
    const { spotifyID } = await response.json();

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

// Given tracks array of tracks, create playlist with them added
router.post("/playlist", async (req, res) => {
    const { playlistName, tracks } = await req.body;
    const [idResponse, tokenResponse] = await Promise.all([
        fetch('http://localhost:8080/api/auth/id'),
        fetch('http://localhost:8080/api/auth/token')
    ]);
    
    const { spotifyID } = await idResponse.json();
    const { access_token } = await tokenResponse.json();

    // create playlist 
    const createBody = JSON.stringify({
        "name": playlistName,
        "description": 'from mood tunes',
        "public": false
    });

    const createOptions = {
        method: 'POST',
        headers: {
        'Authorization': 'Bearer ' + access_token,
        'Content-Type': 'application/json',
        },
        body: createBody
    };
    
    const createPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${spotifyID}/playlists`, createOptions);
    const responseBody = await createPlaylistResponse.json();
    const id = responseBody.id;

    // add tracks to playlist
    const addBody = JSON.stringify({
        "uris": tracks.map((track) => track.track.uri),
        "position": 0
    });

    const addOptions = {
        method: 'POST',
        headers: {
        'Authorization': 'Bearer ' + access_token,
        'Content-Type': 'application/json',
        },
        body: addBody
    }

    const addPlaylistResponse = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, addOptions);
    console.log(responseBody);
    console.log(id);
    console.log(createPlaylistResponse);
    console.log(addPlaylistResponse);


});

module.exports = router;