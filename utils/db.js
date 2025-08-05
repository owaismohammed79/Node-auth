import mongoose from "mongoose";

const db = () => {
    mongoose.connect(`${process.env.MONGO_URL}`)
    .then(() => {
        console.log("Connected to Mongo DB")
    })
    .catch((err) => {
        console.log(`Error in connecting to Mongo DB: ${err}`)
    })
}

export default db;
