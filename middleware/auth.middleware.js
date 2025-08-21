import jwt from "jsonwebtoken";

export const isLoggedIn = async(req, res, next) => {
    try {
        const token = req.cookies?.token || undefined;
        if(!token) {
            res.status(400).json({
                success: false,
                message: "Please login"
            })
        }
        console.log("Decoded data:", decoded); //Middlewares have bugs, make sure to add console logs in these and pre/post hooks
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; //Realize how this is safe as this middleaware would intercept all the requests coming from the user and then set this data in the req object (no sensitive data to be put here), and as soon as the response is served to the user this object wont even exist (statelessness of HTTP request)

    } catch (error) {
        console.log("Auth middleware failure")
        res.status(500).json({
            success: false,
            message: "Internal Server error"
        })
    }
    next();
}