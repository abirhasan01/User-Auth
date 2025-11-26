require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
const PORT = process.env.PORT || 3000

connectDB();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(
  cors({
    credentials: true,
  })
);

// ------------ API Endpoints ----------
app.get("/", (req, res)=> {
    res.send("Home Page")
})
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)


app.listen(PORT, ()=> {
    console.log(`Server is running at http://localhost:${PORT}`)
})