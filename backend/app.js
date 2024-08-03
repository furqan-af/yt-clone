import express from "express"
import cors from 'cors'
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectDB from "./db/db.js"
dotenv.config({
    path : "./.env",
})

const app = express()
const port = process.env.PORT || 6000
app.use(cors())
app.use(cookieParser())
app.use(express.json())

import userRouter from "./src/routes/user.routes.js"

app.use("/api/user", userRouter)


connectDB()
.then(() => {
    app.listen(port, () => {
        console.log("Hello World");
    })

})
.catch((err) => {
    console.log(err, "connection failed");
})








export default app