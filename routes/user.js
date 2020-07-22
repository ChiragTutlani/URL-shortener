const express = require("express");
const {
  createUser,
  getCurrentUser,
  updateUser,
  deleteCurrentUser,
} = require("../controllers/user");
const protect = require("../middleware/protect");
const router = express.Router();

// @route /api/user
router.route("/").post(createUser).put(protect, updateUser);
router
  .route("/me")
  .get(protect, getCurrentUser)
  .delete(protect, deleteCurrentUser);

module.exports = router;
