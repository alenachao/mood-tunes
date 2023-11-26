const express = require("express");

var client_id = process.env.REACT_APP_CLIENT_ID;
var client_secret = process.env.REACT_APP_CLIENT_SECRET;

const app = express();

app.listen(8080, () => {
console.log("App is listening on port 8080!");
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.get("/", (req, res) => {
    
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

    async function search(access_token) {
        var trackParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            }
        }
        const response = await fetch('https://api.spotify.com/v1/search?q=' + req + '&type=artist', trackParameters)
        return await response.json();

    }

    getToken().then(response => {
    search(response.access_token).then(results => {
        console.log(results)
        res.send(results)
    })

    });

});



