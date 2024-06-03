/* Routes related to user login */

const express = require("express");
const querystring = require('querystring');
const { getDatabase } = require('.././db');

const router = express.Router();

var client_id = process.env.REACT_APP_CLIENT_ID;
var client_secret = process.env.REACT_APP_CLIENT_SECRET;
global.access_token = ''
global.spotifyID = ''
global.username = ''
global.pfp = ''

// Have user log into a Spotify premium account to enable web playback (https://developer.spotify.com/documentation/web-playback-sdk)
router.get('/authorize', (req, res) => {
    
    const scope = "streaming user-read-email user-read-private playlist-modify-public playlist-modify-private"
    const state = generateRandomString(16);
    
    // Login and redirect
    const auth_query_parameters = new URLSearchParams({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: "http://localhost:5173/api/auth/callback",
        state: state
    })

    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
});

// After user logs in, turn authorization code into access token
router.get('/callback', async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;

    if (state === null) {
        res.redirect('/#' +
          querystring.stringify({
            error: 'state_mismatch'
          }));
      } else {

        // Prepare the data for the POST request
        const postData = querystring.stringify({
            code: code,
            redirect_uri: 'http://localhost:5173/api/auth/callback',
            grant_type: 'authorization_code'
        });

        const options = {
            method: 'POST',
            headers: {
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: postData
        };

        try {
            const response = await fetch('https://accounts.spotify.com/api/token', options);

            if (response.ok) {
                const responseBody = await response.json();
                global.access_token = responseBody.access_token;
                // Get user info
                var userParameters = {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'Content-Type': 'application/json'
                    }
                }
                
                const userResponse = await fetch('https://api.spotify.com/v1/me', userParameters);

                const userResponseBody = await userResponse.json();
                spotifyID = userResponseBody.id;
                username = userResponseBody.display_name
                pfp = userResponseBody.images[0].url


                // Update Database
                var dbParameters = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userResponseBody),
                }

                await fetch('http://localhost:8080/api/auth/login', dbParameters).then(response => response.json())
                .then(data => {
                    // Log the response data on the client side
                    console.log('Server Response:', data);
                    res.redirect('/');
                })
                .catch(error => {
                console.error('Error:', error);
                });

            } else {
                console.error(`Error: ${response.statusText}`);
                res.status(response.status).send('Error during authentication');
            }
        } catch (error) {
            console.error(`Error: ${error.message}`);
            res.status(500).send('Internal Server Error');
        }
    }
})

// Return access token
router.get('/token', (req, res) => {
    res.json({ access_token: global.access_token})
})

// Return SpotifyID
router.get('/id', (req, res) => {
    res.json({ spotifyID: global.spotifyID})
})

// Return username and pfp url
router.get('/user', (req, res) => {
    res.json({ 
        username: global.username,
        pfp: global.pfp
    })
})

// Checks if user is in database based on spotify id. if not found, add to database. if found, load previous song selections.
router.post('/login', async (req, res) => {
    /* request sample:
            {
                "country": "string",
                "display_name": "string",
                "email": "string",
                "explicit_content": {
                    "filter_enabled": false,
                    "filter_locked": false
                },
                "external_urls": {
                    "spotify": "string"
                },
                "followers": {
                    "href": "string",
                    "total": 0
                },
                "href": "string",
                "id": "string",
                "images": [
                    {
                    "url": "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
                    "height": 300,
                    "width": 300
                    }
                ],
                "product": "string",
                "type": "string",
                "uri": "string"
            }
    */

    spotifyID = req.body.id
    username = req.body.display_name
    apiEndpoint = req.body.href
    profilePicture = req.body.images[0].url
    accountType = req.body.product

    // check if the user exists in the database
    const userExists = await userExistsInDatabase(spotifyID);

    if (!userExists) {
        // user doesn't exist, add them to the database
        await addUserToDatabase({
            spotifyID : spotifyID,
            username : username, 
            apiEndpoint: apiEndpoint, 
            profilePicture: profilePicture, 
            accountType: accountType});
        res.json({ message: 'User added to the database.' });
    } else {
        // user exists
        res.json({ message: 'User found in the database.' });
    }
});

/* Helper Functions */

// Randomly generate a string to protect against attacks such as cross-site request forgery
var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

// Return if user already exists in database
async function userExistsInDatabase(id) {
    const db = getDatabase();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ spotifyID: id });
    return !!user; // Returns true if the user exists, false otherwise
}

// Add user to database
async function addUserToDatabase(userData) {
    const db = getDatabase();
    const usersCollection = db.collection('users');
    await usersCollection.insertOne(userData);
}
  
module.exports = router;