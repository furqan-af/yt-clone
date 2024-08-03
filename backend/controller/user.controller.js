import User from "../models/user.model.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};


export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if ([name, email, password].some((fild) => fild?.trim() == "")) {

        res.status(404).json({ error: "all fild are required" })
    }
    try {
        const user = await User.create({ name, email, password });
        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, 
        });

        res.status(201).json({ success: true, token });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email && !password) {
        res.status(404).json({
            error: "email & password not found"
        })

    }
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(200).json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const logoutUser = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({ success: true, message: 'Logged out' });
};



export const getUser = async (req, res) => {

    const logedinUser = req.user._id

    return res.status(200).json(req.user, logedinUser, { messege: "user fetch successfully" })


}

export const deleteUser = async (req, res) => {
  
    const user = User.findByIdAndDelete(
        req.user?._id, function (error, docs) {

            if (error) {
                console.log(error);
                
            }
            else{
                console.log(docs);
            }

        }
    )

    return res.status(200).json({user,messege : "user delete successefully"})

}


export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: "Both old and new passwords are required" });
        }

        const user = await User.findById(req.user?._id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(409).json({ error: "Invalid old password" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedNewPassword;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({ message: "Password changed successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while changing the password" });
    }

}


export const updateDeatailsUser = async (req, res) => {

    const { name, email } = req.body
    if (!name && !email) {
        res.status(400).json({error : "All fild are required"})
        
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                name,
                email
            },
            
        },
        {
            new:true
        }
    ).select("-password")
   

    return res.status(200).json({ user,
        messege : "Account details are updated Successfully"
    })
}












