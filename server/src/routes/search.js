/* Routes related to searching and selecting songs */

const express = require("express");
const router = express.Router();

var client_id = process.env.SPOTIFY_CLIENT_ID;
var client_secret = process.env.SPOTIFY_CLIENT_SECRET;

// Get search result tracks using Spotify API
router.get("/", (req, res) => {
    
    // Get authorization token from Spotify
    async function getToken() {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            body: new URLSearchParams({
            'grant_type': 'client_credentials',
            }),
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
            },
        });

        return await response.json();
    }

    // Search for track using Spotify API
    async function search(access_token) {
        var trackParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            }
        }

        const response = await fetch('https://api.spotify.com/v1/search?q=' + decodeURIComponent(req.query.q) + '&type=track' + '&limit=7', trackParameters)
        return await response.json();
    }

    // Return tracks
    getToken().then(response => {
    search(response.access_token).then(results => {
        res.send(results)
    })

    });

});

module.exports = router;