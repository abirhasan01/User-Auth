require("dotenv").config()
const mongoose = require("mongoose")


const connectDB = async () => {
    await mongoose.connect(process.env.DB_URL)
    .then(()=> {
        console.log(`db is connected`)
    })
    .catch((err) => {
        console.log(`db is not connected`)
        console.log(err.message)
        process.exit(1)
    })
}

module.exports = connectDB