const express = require('express');
const { getDatabase } = require('./db');

const router = express.Router();

router.use(express.json());

// Handle user login: Checks if user is in database based on spotify id. if not found, add to database. if found, load previous song selections.
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

    // interested in display_name, id, href, images, product
    // console.log(req.body)
    spotifyID = req.body.id
    username = req.body.display_name
    apiEndpoint = req.body.href
    profilePicture = req.body.images[0].url
    accountType = req.body.product

    // Check if the user exists in the database
    const userExists = await userExistsInDatabase(spotifyID);

    if (!userExists) {
        // User doesn't exist, add them to the database
        await addUserToDatabase({
            spotifyID : spotifyID,
            username : username, 
            apiEndpoint: apiEndpoint, 
            profilePicture: profilePicture, 
            accountType: accountType});
        res.json({ message: 'User added to the database.' });
    } else {
        // User exists, query previous song selections
        //const previousSongs = await getPreviousSongSelections(spotifyId);
        res.json({ message: 'User found in the database.' });
    }
    });

    async function userExistsInDatabase(spotifyId) {
        const db = getDatabase();
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ spotifyId });
        return !!user; // Returns true if the user exists, false otherwise
    }

    async function addUserToDatabase(userData) {
        const db = getDatabase();
        const usersCollection = db.collection('users');
        await usersCollection.insertOne(userData);
    }

    // async function getPreviousSongSelections(spotifyId) {
    //     const db = getDatabase();
    //     const songsCollection = db.collection('songs');
    //     const previousSongs = await songsCollection.find({ userId: spotifyId }).toArray();
    //     return previousSongs;
    // }

module.exports = router;
