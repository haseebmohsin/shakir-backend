import { Router } from "express";
import {
  createVideo,
  deleteVideo,
  getAllVideos,
  getVideoById,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
// Apply verifyJWT middleware to all routes in this file
// router.use(verifyJWT);

router.route("/").get(getAllVideos).post(createVideo);
router.route("/:videoId").get(getVideoById).delete(deleteVideo);

export default router;
