import express, { urlencoded } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js"
import dotenv from "dotenv";
import db from "./utils/db.js"


dotenv.config();
//initialize express app
app = express();

const port = process.env.PORT || 4000

//app.use wali statements (initial middlewares)
app.use(cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json()); //This is to tell express that I'll use json data, so you need to parse it 
app.use(urlencoded({ extended: true})); //These are to encode and decode url data and extended means to use the newer version 

//db() call
db();

//main routing towards braches like user and admin appending the main route
app.get('/owais', (req, res) => {
    res.send("Owais route hit");
})

app.use("/api/v1/users", userRoutes);

//app.run
app.listen(port, () => {
    console.log(`App started at port ${port}`)
})