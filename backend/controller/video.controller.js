import { Video } from "../models/video.model.js"; 
import { ApiError } from "../utils/apiError.js";   
import { ApiResponse } from "../utils/apiResponse.js"; 

// Create a new video
export const createVideo = async (req, res) => {
    const { videoFile, thumbnail, title, description, duration, isPublished } = req.body;
    const owner = req.user._id; // Assuming user authentication middleware adds user to req

    if (!videoFile || !thumbnail || !title || !description || !duration) {
        return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    try {
        const video = new Video({ videoFile, thumbnail, title, description, duration, isPublished, owner });
        await video.save();

        return res.status(201).json(new ApiResponse(201, video, "Video created successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
};

// Get all videos
export const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find().populate('owner', 'name'); // Populate owner with user name
        return res.status(200).json(new ApiResponse(200, videos, "Videos retrieved successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
};

// Get a video by ID
export const getVideoById = async (req, res) => {
    const { id } = req.params;

    try {
        const video = await Video.findById(id).populate('owner', 'name');
        if (!video) {
            return res.status(404).json(new ApiError(404, "Video not found"));
        }
        return res.status(200).json(new ApiResponse(200, video, "Video retrieved successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
};

// Update a video by ID
export const updateVideo = async (req, res) => {
    const { id } = req.params;
    const { videoFile, thumbnail, title, description, duration, isPublished } = req.body;

    try {
        const video = await Video.findByIdAndUpdate(id, { videoFile, thumbnail, title, description, duration, isPublished }, { new: true, runValidators: true });
        if (!video) {
            return res.status(404).json(new ApiError(404, "Video not found"));
        }
        return res.status(200).json(new ApiResponse(200, video, "Video updated successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
};

// Delete a video by ID
export const deleteVideo = async (req, res) => {
    const { id } = req.params;

    try {
        const video = await Video.findByIdAndDelete(id);
        if (!video) {
            return res.status(404).json(new ApiError(404, "Video not found"));
        }
        return res.status(200).json(new ApiResponse(200, null, "Video deleted successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
};

// Increment the view count of a video
export const incrementViewCount = async (req, res) => {
    const { id } = req.params;

    try {
        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json(new ApiError(404, "Video not found"));
        }
        video.views += 1;
        await video.save();

        return res.status(200).json(new ApiResponse(200, video, "View count incremented"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
};

// Publish/Unpublish a video
export const togglePublishStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json(new ApiError(404, "Video not found"));
        }
        video.isPublished = !video.isPublished;
        await video.save();

        return res.status(200).json(new ApiResponse(200, video, `Video ${video.isPublished ? "published" : "unpublished"} successfully`));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
};
