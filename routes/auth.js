const express = require("express");
const { login, logout } = require("../controllers/auth");
const protect = require("../middleware/protect");

const router = express.Router();

router.post("/login", login);
router.get("/logout", protect, logout);

module.exports = router;
