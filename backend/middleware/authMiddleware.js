require("dotenv").config()
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const User = require("../models/user.model")

const protect = asyncHandler(async (req, res, next) => {
    let token;

    token = req.cookies.jwt

    if(token){
        try {
            const cleanToken = token.replace("Bearer ", "");
            const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userID).select("-password")
            next()
        } catch (error) {
            res.status(401)
            throw new Error("Not Authorized, Invalid token");
        }
    }else {
        res.status(401)
        throw new Error("Not Authorized, no token")
    }
})

module.exports = protect