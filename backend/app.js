import express from "express"
import connectDB from "./db/db.js"
import dotenv from "dotenv"

dotenv.config({
    path: './.env'
})

const app = express()

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
        })

    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    })


export default app