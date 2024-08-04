import { Tweet } from "../models/tweet.model.js"; 
import { ApiError } from "../utils/apiError.js";  
import { ApiResponse } from "../utils/apiResponse.js"; 

// Create a new tweet
export const createTweet = async (req, res) => {
    const { content } = req.body;
    const owner = req.user._id; 

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    try {
        const tweet = new Tweet({ content, owner });
        await tweet.save();

        return res.status(201).json(new ApiResponse(201, tweet, "Tweet created successfully"));
    } catch (error) {
        throw new ApiError(500, "Failed to create tweet", [error.message]);
    }
};

// Get all tweets
export const getAllTweets = async (req, res) => {
    try {
        const tweets = await Tweet.find().populate('owner', 'name'); 
        return res.status(200).json(new ApiResponse(200, tweets, "Tweets retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, "Failed to retrieve tweets", [error.message]);
    }
};

// Get a tweet by ID
export const getTweetById = async (req, res) => {
    const { id } = req.params;

    try {
        const tweet = await Tweet.findById(id).populate('owner', 'name');
        if (!tweet) {
            throw new ApiError(404, "Tweet not found");
        }
        return res.status(200).json(new ApiResponse(200, tweet, "Tweet retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, "Failed to retrieve tweet", [error.message]);
    }
};

// Update a tweet by ID
export const updateTweet = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    try {
        const tweet = await Tweet.findByIdAndUpdate(id, { content }, { new: true, runValidators: true });
        if (!tweet) {
            throw new ApiError(404, "Tweet not found");
        }
        return res.status(200).json(new ApiResponse(200, tweet, "Tweet updated successfully"));
    } catch (error) {
        throw new ApiError(500, "Failed to update tweet", [error.message]);
    }
};

// Delete a tweet by ID
export const deleteTweet = async (req, res) => {
    const { id } = req.params;

    try {
        const tweet = await Tweet.findByIdAndDelete(id);
        if (!tweet) {
            throw new ApiError(404, "Tweet not found");
        }
        return res.status(200).json(new ApiResponse(200, null, "Tweet deleted successfully"));
    } catch (error) {
        throw new ApiError(500, "Failed to delete tweet", [error.message]);
    }
};
