const User = require("../models/user.model")


const getUserData = async (req, res) => {
    try {
        const {userID} = req
        const user = await User.findById(userID)

        if(!user){
            return res.json({
              success: false,
              message: "User not found",
            });
        }
        res.json({
          success: true,
          userData: {
            name: user.name,
            isAccountVerified: user.isAccountVerified,
          },
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}
module.exports = {
    getUserData
}