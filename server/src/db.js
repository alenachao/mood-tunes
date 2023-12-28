const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_CONNECTION_STRING;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

function getDatabase() {
  return client.db('Users Database');
}

module.exports = { connectToDatabase, getDatabase };