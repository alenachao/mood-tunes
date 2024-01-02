# Mood Tunes
Log your daily emotions through songs! This web appliction uses:
- TypeScript + React + Redux + MUI + RRD + ESLint + Prettier (from [vite-mui-ts boilerplate](https://github.com/emre-cil/vite-mui-ts)) for client side code
- Node + Express for server side code
- MongoDB for database management 
- [Spotify Web API](https://developer.spotify.com/documentation/web-api) to search songs
- [Spotify Webplayback SDK](https://developer.spotify.com/documentation/web-playback-sdk) to play back songs
gif

# Installation
## 1. Requirements
Install requirements for both client and server.
```
cd client
npm install
cd ../server
npm install
```
## 2. Database
Install [MongoDB](https://www.mongodb.com/docs/manual/installation/) and [Mongosh](https://www.mongodb.com/docs/mongodb-shell/install/), then edit the db.js file to connect to your database.
```
const connectionString = "your-database-connection-string";
```
```
return client.db('your-database-name');
```
## 3. Spotify API credentials
Create app and get client id + client secret as described in [Spotify API's getting started guide](https://developer.spotify.com/documentation/web-api/tutorials/getting-started#create-an-app) and set them as environment variables. Make sure to add http://localhost:5173/api/auth/callback as a redirect uri for the created app.
## 4. Run application
To run application, simply run ```npm start``` in both the client and server folders.


