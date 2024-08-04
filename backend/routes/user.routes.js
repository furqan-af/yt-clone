import { Router } from 'express';
import {
    createVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    incrementViewCount,
    togglePublishStatus
} from '../controller/video.controller.js';
import verifyJWT from '../middleware/verifyJWT.js';

const router = Router();

router.route('/videos').post(verifyJWT, createVideo); // Create a new video
router.route('/videos').get(getAllVideos); // Get all videos

router.route('/videos/:id').get(getVideoById); // Get a video by ID
router.route('/videos/:id').put(verifyJWT, updateVideo); // Update a video by ID
router.route('/videos/:id').delete(verifyJWT, deleteVideo); // Delete a video by ID
router.route('/videos/:id/view').patch(incrementViewCount); // Increment view count
router.route('/videos/:id/publish').patch(verifyJWT, togglePublishStatus); // Toggle publish status

export default router;


