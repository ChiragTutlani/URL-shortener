const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sendTokenResponse = require("../middleware/sendTokenResponse");

// @desc  Create an user
// @route POST /api/user
// @access  Public
exports.createUser = async (req, res) => {
  try {
    if (!req.body.password || !req.body.password2) {
      res.status(400).json({
        success: false,
        error: "Please provide password",
      });
      return;
    }

    if (req.body.password !== req.body.password2) {
      res.status(400).json({
        success: false,
        error: "Passwords do not match",
      });
      return;
    }

    const user = await User.create(req.body);

    sendTokenResponse(user, 200, res);
  } catch (err) {
    let message = "";
    if (err.code === 11000) {
      message = "Email already exist";
    }
    res.status(500).json({
      success: false,
      error:
        message === "" ? "Problem occurred. Please try again later." : message,
    });
  }
};

// @desc  Get current user
// @route GET /api/user/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("urlId");
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

// @desc  Update logged in user
// @route PUT /api/user
// @access  Private
exports.updateUser = async (req, res) => {
  let user = await User.findById(req.user.id);

  if (user) {
    try {
      if (req.body.oldPassword && req.body.password !== req.body.password2) {
        res.status(400).json({
          success: false,
          error: "Passwords do not match",
        });
        return;
      } else if (
        req.body.password &&
        !bcrypt.compareSync(req.body.oldPassword, user.password)
      ) {
        res.status(400).json({
          success: false,
          error: "Invalid password",
        });
        return;
      }

      if (req.body.oldPassword)
        req.body.password = bcrypt.hashSync(req.body.password, 10);

      if (req.body.urlId) delete req.body.urlId;

      user = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        error: err,
      });
    }
  } else {
    res.status(404).json({
      success: false,
      error: "Bad request",
    });
  }
};

// @desc  Delete current user
// @route DELETE /api/user/me (delete current logged in user)
// @access  Private
exports.deleteCurrentUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    sendTokenResponse({}, 200, res, true);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err,
    });
  }
};
