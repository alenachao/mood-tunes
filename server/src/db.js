const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config(); 

const connectionString = process.env.MONGODB_URL;

const client = new MongoClient(connectionString);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

function getDatabase() {
  return client.db('moodtunes');
}

module.exports = { connectToDatabase, getDatabase };