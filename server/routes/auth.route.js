
const { registerUser, login, logout, isAuthenticated, sendResetOtp, resetPassword, sendVerifyOtp, verifyEmail } = require("../controllers/auth.controller")
const userAuth = require("../middleware/userAuth")

const authRouter = require("express").Router()


authRouter.post("/register", registerUser)
authRouter.post("/login", login)
authRouter.post("/logout", logout)
authRouter.post("/send-verity-otp", userAuth, sendVerifyOtp)
authRouter.post("/verify-account", userAuth, verifyEmail)
authRouter.post("/is-auth", userAuth, isAuthenticated)
authRouter.post("/send-reset-otp", sendResetOtp)
authRouter.post("/reset-password", resetPassword)

module.exports = authRouter