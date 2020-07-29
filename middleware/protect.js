const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.cookies.token) {
      token = req.cookies.token;
    } else {
      throw Error();
    }

    const decodedID = jwt.verify(token, process.env.JWT_SECRET).id;

    // attach logged in user to request
    const user = await User.findById(decodedID).select("-password");

    if (!user) {
      throw Error();
    }

    req.user = user;
    next();
  } catch (err) {
    const options = {
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days,
      httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") {
      options.secure = true;
    }
    res.status(401).clearCookie("token", options).json({
      success: false,
      error: "Unauthorized request",
    });
  }
};

module.exports = protect;
