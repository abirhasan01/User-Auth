require("dotenv").config()
const jwt = require("jsonwebtoken")

const userAuth = async (req, res, next)=> {
    const token = req.cookies.token;

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.SECRET_KEY);
         
        if(tokenDecode.id){
            req.userID = tokenDecode.id 
        }else {
            return res.json({
              success: false,
              message: "Not Authorized Login Again",
            });
        }
        next()
    } catch (error) {
        res.json({
          success: false,
          message: error.message,
        });
    }
}
module.exports = userAuth