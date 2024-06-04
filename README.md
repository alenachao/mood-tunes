# Mood Tunes 📻
Log your daily emotions through songs 🙂
- Select one song each day that describes your mood
- See which days/songs correlated to more negative/positive emotions and how they were distributed over the month
- Export playlist of tracks each month \
![](https://github.com/alenachao/mood-tunes/blob/main/read-me-demo.gif)
![image](https://github.com/alenachao/mood-tunes/assets/122919697/45fd0006-055f-4cf3-aaf2-a76ea3ccb393)
![image](https://github.com/alenachao/mood-tunes/assets/122919697/a85690e6-85b8-4f33-8260-2e8d3fe22acf)

This appliction uses:
- TypeScript + React + Redux + MUI + RRD + ESLint + Prettier (from [vite-mui-ts boilerplate](https://github.com/emre-cil/vite-mui-ts)) for client side code
- Node + Express for server side code
- MongoDB for database management 
- [Spotify Web API](https://developer.spotify.com/) to authenticate user and implement song related features

# Getting Started 📄
## 1. Clone Repo
``` 
git clone git@github.com:alenachao/mood-tunes.git
```
## 2. Install Dependencies
Install [Node and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to manage packages, then install requirements for both client and server.
```
cd client
npm install
cd ../server
npm install
```
## 2. Setup Database
Install [MongoDB](https://www.mongodb.com/docs/manual/installation/) and [Mongosh](https://www.mongodb.com/docs/mongodb-shell/install/), then edit the db.js file to connect to your database.
```
const connectionString = "your-database-connection-string";
```
```
return client.db('your-database-name');
```
## 3. Get Spotify API credentials
Create app and get client id + client secret as described in [Spotify API's getting started guide](https://developer.spotify.com/documentation/web-api/tutorials/getting-started#create-an-app) and set them as environment variables. Make sure to add http://localhost:5173/api/auth/callback as a redirect uri for the created app.
## 4. Run application
To run application, simply run ```npm start``` in both the client and server folders.


