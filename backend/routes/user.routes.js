import { registerUser, loginUser, getUser, changePassword, deleteUser, updateDeatailsUser, logoutUser } from "../controller/user.controller.js";
import { Router } from "express";
import verifyJWT from '../middleware/verifyJWT.js'

const router = Router()
router.route("/regester").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/change-password").post(verifyJWT,changePassword)
router.route("/currenet-user").get(verifyJWT,getUser)
router.route("/deleteUser").post(verifyJWT,deleteUser)
router.route("/update-profile").patch(verifyJWT,updateDeatailsUser)



export default router




