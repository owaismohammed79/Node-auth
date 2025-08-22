import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import userRoutes from "./routes/user.routes.js"
import db from "./utils/db.js"
import cookieParser from "cookie-parser";
import passport from "./utils/passport.js";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";


//initialize express app
const app = express();
const port = process.env.BACKEND_PORT || 4000

// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "User Authentication API",
            version: "1.0.0",
            description: "API documentation for the user authentication system",
        },
        servers: [
            {
                url: `${process.env.BASE_URL}`,
            },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'token'
                }
            }
        },
        security: [{
            cookieAuth: []
        }]
    },
    apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


//app.use wali statements (initial middlewares)
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json()); //This is to tell express that I'll use json data, so you need to parse it 
app.use(urlencoded({ extended: true})); //These are to encode and decode url data and extended means to use the newer version 
app.use(cookieParser()); //This is so that we can parse cookies in req and send them in res

app.use(express.static('public'));

// Initialize Passport
app.use(passport.initialize());

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