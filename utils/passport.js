import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../model/User.model.js";
import dotenv from "dotenv";
dotenv.config();
//This is actually a middleware
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/v1/users/auth/google/callback`,
    scope: ["profile", "email"]
},
async (accessToken, refreshToken, profile, done) => {
    try {
        //Find if a user with this googleId already exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            //If user exists, pass the user object to the next middleware
            return done(null, user); //This is a function provided by passport to indicate it that the authentication is complete,
            //the first argument it takes is the error 2nd is authenticated user object
        }

        //Find if a user with this email already exists
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
            //If user with email exists, link the googleId to their account
            user.googleId = profile.id;
            user.avatar = profile.photos[0].value;
            await user.save();
            return done(null, user);
        }

        //If no user is found, create a new user
        const newUser = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            isVerified: true //User is verified through Google
        });

        return done(null, newUser);

    } catch (error) {
        return done(error, null);
    }
}));

//This is called only once after the auth is complete, it is used to define the data that you'd want to store in the session (this is stored in the server in memory or Redis...) In our case it's user id. Just storing the user id is a scalable way of doing this.
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//On all the subsequent requests from the user, this is called and this finds the use by his id, and then puts it in req.user so that other route handlers can access it
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;