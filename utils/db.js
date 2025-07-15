import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const db = () => {
    mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to Mongo DB")
    })
    .error((err) => {
        console.log(`Error in connecting to Mongo DB: ${err}`)
    })
}

export default db;
