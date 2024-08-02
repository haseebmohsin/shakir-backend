import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create a new video
const createVideo = asyncHandler(async (req, res) => {
  const { videoUrl, user } = req.body;

  if (!videoUrl || videoUrl.trim() === "") {
    res.status(400).json({
      errorMessage: "Video URL is required",
    });
  }

  const video = new Video({
    videoUrl,
    owner: user._id,
  });

  await video.save();

  // get all the videos
  const videos = await Video.find().populate("owner", "username email").exec();

  return res
    .status(201)
    .json(new ApiResponse(201, videos, "Video created successfully"));
});

// Get all videos
const getAllVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find().populate("owner", "username email").exec();

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

// Get a single video by ID
const getVideoById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Video ID is required");
  }

  const video = await Video.findById(id)
    .populate("owner", "username email")
    .exec();

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

// Update a video
const updateVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { videoUrl } = req.body;

  if (!id || !videoUrl || videoUrl.trim() === "") {
    throw new ApiError(400, "Video ID and new video URL are required");
  }

  const video = await Video.findById(id).exec();

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (String(video.owner) !== String(req.user._id)) {
    throw new ApiError(403, "Unauthorized to update this video");
  }

  video.videoUrl = videoUrl;
  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully"));
});

// Delete a video
const deleteVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Video ID is required");
  }

  const video = await Video.findById(id).exec();

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (
    String(video.owner) !== String(req.user._id) &&
    req.user.role !== "admin" &&
    req.user.role !== "superadmin"
  ) {
    throw new ApiError(403, "Unauthorized to delete this video");
  }

  await video.remove();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

export { createVideo, getAllVideos, getVideoById, updateVideo, deleteVideo };
