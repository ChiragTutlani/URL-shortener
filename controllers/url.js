const Url = require("../models/Url");
const shortid = require("shortid");
const validUrl = require("valid-url");

// @desc  Create a short-url
// @route POST /api/url
// @access  Private
exports.createUrl = async (req, res) => {
  try {
    if (!req.body.originalUrl) {
      res.status(400).json({
        success: false,
        error: "Please enter an URL",
      });
    }

    if (!validUrl.isUri(req.body.originalUrl)) {
      res.status(400).json({
        success: false,
        error: "Please enter a valid URL",
      });
    }

    if (req.body.timesUsed) req.body.timesUsed = 0;

    const urlCode = shortid.generate();

    req.body.urlCode = urlCode;
    req.body.shortUrl = process.env.BASE_URL + urlCode;
    req.body.userId = req.user._id;

    const url = await Url.create(req.body);

    res.status(201).json({
      success: true,
      data: url,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err,
    });
  }
};

// @desc Delete url
// @route DELETE /api/url/:id
// @access Private
exports.deleteUrl = async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);

    if (req.user.id.toString() !== url.userId.toString()) {
      res.status(400).json({
        success: false,
        error: "Unauthorized request",
      });
      return;
    }

    await url.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};
