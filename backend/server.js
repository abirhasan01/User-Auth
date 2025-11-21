require("dotenv").config()
require("./config/db")
const express = require("express")
const  userRoute  = require("./routes/user.route")
const { notFound, errorHandler } = require("./middleware/error.middleware")
const cors = require("cors")
const port = process.env.PORT || 4000
const app = express()
const cookieParser = require("cookie-parser");



app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors())

app.get("/", (req, res) => {
    res.send("server is ready")
})
app.use("/api/users", userRoute)



app.use(notFound)
app.use(errorHandler)

app.listen(port, ()=> {
    console.log(`Server is running at http://localhost:${port}`)
})