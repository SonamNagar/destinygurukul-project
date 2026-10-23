import mongoose from "mongoose";
import 'dotenv/config'

const connectDb = async (retries = 5) => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    console.error("❌ MONGO_URI is not defined in environment variables!");
    console.error("   Make sure you have set MONGO_URI in Render Dashboard → Environment tab");
    process.exit(1);
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        w: "majority",
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`❌ MongoDB Connection Attempt ${attempt}/${retries} Failed:`, error.message);

      if (attempt < retries) {
        console.log(`   ⏳ Retrying in 5 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } else {
        console.error("❌ All MongoDB connection attempts failed!");
        console.error("   👉 Check MongoDB Atlas → Network Access → Allow 0.0.0.0/0");
        console.error("   👉 Check Render → Environment → MONGO_URI is set correctly");
        process.exit(1);
      }
    }
  }
};

export default connectDb;