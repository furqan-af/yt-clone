import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Register User
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if ([name, email, password].some(field => !field.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    try {
        const user = await User.create({ name, email, password });
        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return res.status(201).json(new ApiResponse(201, { token }, "User registered successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
};

// Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new ApiError(401, "Invalid credentials");
        }

        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return res.status(200).json(new ApiResponse(200, { token }, "User logged in successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
};

// Logout User
export const logoutUser = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    return res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
};

// Get User
export const getUser = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
};

// Delete User
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        return res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
};

// Change Password
export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Both old and new passwords are required");
    }

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            throw new ApiError(400, "Invalid old password");
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json(new ApiResponse(200, null, "Password changed successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "An error occurred while changing the password"));
    }
};

// Update User Details
export const updateUserDetails = async (req, res) => {
    const { name, email } = req.body;

    if (!name && !email) {
        throw new ApiError(400, "At least one field is required");
    }

    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { name, email } },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
};
