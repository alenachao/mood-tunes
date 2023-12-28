const express = require("express");
const querystring = require('querystring');
const { connectToDatabase } = require('./db');
const routes = require('./routes');
const app = express();

var client_id = process.env.REACT_APP_CLIENT_ID;
var client_secret = process.env.REACT_APP_CLIENT_SECRET;

global.access_token = ''

connectToDatabase();

app.listen(8080, () => {
console.log("App is listening on port 8080!");
});

app.use('/api', routes);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Randomly generate a string to protect against attacks such as cross-site request forgery
var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

// Have user log into a Spotify premium account to enable web playback (https://developer.spotify.com/documentation/web-playback-sdk)
app.get('/auth/login', (req, res) => {
    
    var scope = "streaming user-read-email user-read-private"
    var state = generateRandomString(16);
    
    // Login and redirect
    var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: client_id,
    scope: scope,
    redirect_uri: "http://localhost:5173/auth/callback",
    state: state
    })

    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
});

// After user logs in, turn authorization code into access token
app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;

    // Prepare the data for the POST request
    const postData = querystring.stringify({
        code: code,
        redirect_uri: 'http://localhost:5173/auth/callback',
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
            access_token = responseBody.access_token;
            // Get user info
            var userParameters = {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            }
            
            const userResponse = await fetch('https://api.spotify.com/v1/me', userParameters);

            // Update Database
            var dbParameters = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(response),
            }

            dbResponse = await fetch('/api/login', dbParameters);

            // Redirect user to home page
            res.redirect('/home');
        } else {
            console.error(`Error: ${response.statusText}`);
            res.status(response.status).send('Error during authentication');
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).send('Internal Server Error');
    }
})

// Return access token
app.get('/auth/token', (req, res) => {
    res.json({ access_token: access_token})
  })
  
// Get search result track using Spotify API
app.get("/", (req, res) => {
    
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



