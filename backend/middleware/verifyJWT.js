import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
        

        if (!token) {
            return res.status(401).json({ error: "Unauthorized request" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        //  console.log(decodedToken);
         
        const user = await User.findById(decodedToken.id).select("-password")
        console.log(user);
        

        if (!user) {
            return res.status(401).json({ error: "Invalid user" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(401).json({ error: "Invalid access token" });
    }
};

export default verifyJWT;
