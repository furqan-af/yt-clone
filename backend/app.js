import express from "express"
import cors from 'cors'
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectDB from "./db/db.js"
import { ApiError } from "./utils/apiError.js"
import { ApiResponse } from "./utils/apiResponse.js"
dotenv.config({
    path : "./.env",
})

const app = express()
const port = process.env.PORT || 6000
app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(err);
    }

    // Handle unexpected errors
    console.error(err); 
    return res.status(500).json(new ApiError(500, "An unexpected error occurred", [err.message]));
});

import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'

app.use("/api/user", userRouter)
app.use("/api/video", videoRouter)


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