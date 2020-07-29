const sendTokenResponse = (user, statusCode, res, emptyToken = false) => {
  const options = {
    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  if (emptyToken) {
    res.status(statusCode).clearCookie("token", options).json({
      success: true,
      data: user,
    });
    return;
  }

  // Create token
  const token = user.getSignedJWTToken();

  if (user.password) {
    // convert user to JSON object and then remove password field
    user = user.toJSON();
    delete user.password;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    data: user,
  });
};

module.exports = sendTokenResponse;
