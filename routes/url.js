const express = require("express");
const { createUrl, deleteUrl } = require("../controllers/url");
const protect = require("../middleware/protect");

const router = express.Router();

router.route("/").post(protect, createUrl);
router.route("/:id").delete(protect, deleteUrl);

module.exports = router;
