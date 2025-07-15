import User from "../model/User.model";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config()

const registerUser = async(req, res) => {
    //Take username and email from user
    const {name, email, password} = req.body;
    //Check for formats if correct or not
    if(!name || !email || !password){
        res.status(400).json({
            message: "All fields are required"
        })
    }
    //Further zod validations
    //Check in DB if already user exists or not
    try {
        const existingUser = await User.findOne({email});
        if(existingUser) {
            res.status(400).json({
                message: "User already exists"
            })
        }
        //Create user in DB
        const newUser = await User.create({name, email, password})
        if(!newUser) {
            res.status(400).json({
                message: "User not registered"
            })
        }
    } catch (error) {
        res.status(400).json({
            error: `Error in registering user: ${error}`
        })
    }
    
    //Create a token and save it in DB and send it to the user via email
    const token = crypto.randomBytes(32).toString("hex");
    newuser.verificationToken = token;
    await newUser.save();

    const transporter = nodemailer.createTransport({
    host: process.env.HOST_MAIL,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
    });
    //If user gives you back the TOKen to another defined route of yours then verify the user in the DB, clear the token in db, isverified is true
    //Redirect user to login page or the homepage
}

const loginUser = async(req, res) => {

}

export {registerUser}