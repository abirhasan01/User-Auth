const mongoose = require("mongoose")
require("dotenv").config()

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log(`db is connected`)
})
.catch((err)=> {
    console.log(`db is not connected`)
    console.log(err.message)
    process.exit(1)
})