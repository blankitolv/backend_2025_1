import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from 'dotenv'
dotenv.config()

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI no está definida en el archivo .env");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
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

export default connectDB;
