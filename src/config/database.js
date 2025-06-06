// config/database.js
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Conectado a MongoDB Atlas");
    return client;
  } catch (error) {
    console.error("❌ Error conectando a MongoDB", error);
    process.exit(1);
  }
}
module.exports = connectDB;