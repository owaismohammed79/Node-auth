import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config()
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


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
    const user = await User.findOne({name, email, password})
    user.verificationToken = token;
    await user.save();
    //For sending test mails (during developemnt), you can use ethereal/Mail trap. For sendind prod emails, u can use sendgrid, mailgun etc 
    try{
        var transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
            user: process.env.MAILTRAP_TEST_USER,
            pass: process.env.MAILTRAP_USER_PASSWORD
        }
        });

        //If user gives you back the ToKen to another defined route of yours then verify the user in the DB, clear the token in db, isverified is true
        const mailOptions = {
            from: '"Mohammed Owais" <maddison53@ethereal.email>', //If you're using mailtrap, it also gives you a sender mail in prod
            to: user.email,
            subject: "Verify your email",
            text: `Please click on the following link: ${process.env.BASE_URL}/api/v1/users/verify/${token}`,
            html: "<b>Hello world?</b>",
        }
        //So basically you're sending the user a clickable button, or link on which if the user clicks then he would send you back the token you sent to his mail to another route
        const info = await transporter.sendMail(mailOptions)
        console.log("Message sent: %s", info.messageId); //One can check how the mail looks like in the console

        res.status(201).json({
            message: "User registered successfully",
            success: true
        })
    } catch(e) {
        res.status(400).json({
            message: "User not registered",
            success: false,
            error: `${e}`
        })
    }
    //Redirect user to login page or the homepage
}

const verifyUser = async(req, res) => {
    const token = req.params;

    if(!token) {
        res.status(400).json({
            message: "Invalid token"
        })
    }
    const user = await User.findOne({verificationToken: token});
    if(!user) {
        res.status(400).json({
            message: "Invalid token" //It actually is user doesn't exist, but why tell the other side that this is the problem
        })
    }
    user.verificationToken = undefined;
    user.isVerified = true;
    await user.save();
}

const loginUser = async(req, res) => {
    //Retrieve email n password from body
    //Validate the fields
    //Check in DB whether user exists or not
    //If exists, then verify password
    //Create session token send to user and save in DB, user would send everytime, you would have to make DB call to check if token
    //exists and is valid (time based)
    //Hence another option is stateless login using JWT, create and send to user, verify JWT on server instead of DB call all the time
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400).json({
            message: "All fields are required"
        })
    }

    try {
        const user = await User.findOne({email});
        if(!user) {
            res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch) {
            res.status(400).json({
                message: "Invalid email or password"
            })
        }

        if(user.isVerified === false) {
            res.status(400).json({
                message: "Please verify email to login"
            })
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, 
            {
                expiresIn: process.env.JWT_EXPIRE_TIME
            }
        )

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 24*60*60*1000 //Cookie's expiration timei.e 24 hour
        }
        res.cookie("token", token, cookieOptions)

        res.status(200).json({
            succcess: true,
            message: "User Login successfull",
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        })

    } catch (error) {
        res.status(500).json({
            message: "Error in finding user",
            error
        })
    }

}

export {registerUser, verifyUser, loginUser};