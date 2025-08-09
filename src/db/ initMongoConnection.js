import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const initMongoConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log("Mongo connection successfully established!");
    console.log(mongoose.connection.name);
  } catch (error) {
    console.log("Mongo connection error");
    process.exit(1);
  }
};

export default initMongoConnection;
