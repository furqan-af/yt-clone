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

router.route('/videos').post(verifyJWT, createVideo); 
router.route('/videos').get(getAllVideos); 
router.route('/videos/:id').get(getVideoById); 
router.route('/videos/:id').put(verifyJWT, updateVideo); 
router.route('/videos/:id').delete(verifyJWT, deleteVideo); 
router.route('/videos/:id/view').patch(incrementViewCount); 
router.route('/videos/:id/publish').patch(verifyJWT, togglePublishStatus); 

export default router;
