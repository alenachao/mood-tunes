const express = require("express");
const { connectToDatabase } = require('./db');
const routes = require('./routes');
const cors = require("cors");

const app = express();
connectToDatabase();

app.use(express.json());

app.use('/api', routes);

app.use(cors());

app.listen(8080, () => {
    console.log("App is listening on port 8080!");
});




