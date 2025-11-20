const { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile } = require("../controllers/user.controller")
const protect = require("../middleware/authMiddleware")

const router = require("express").Router()



router.post("/auth", authUser)
router.post("/", registerUser)
router.post("/logout", logoutUser)
router.get("/profile", protect ,getUserProfile)
router.put("/profile", protect ,updateUserProfile)




module.exports = router