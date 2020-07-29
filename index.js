require("dotenv").config();
const express = require("express");
const path = require("path");
const DBconnect = require("./util/DBconnect");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const urlRoutes = require("./routes/url");
const cookierParser = require("cookie-parser");
const cors = require("cors");
const shortid = require("shortid");
const Url = require("./models/Url");

DBconnect(process.env.MONGO_URI);

const app = express();

app.use(express.json());
app.use(cookierParser());
app.use(cors());

app.use(express.static(path.join(__dirname, "/client/build")));

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes);

// @desc Read and redirect to original-url
// @route GET /:urlCode
// @access Public
app.get("/:urlCode", async (req, res, next) => {
  if (!shortid.isValid(req.params.urlCode)) {
    next();
  }
  try {
    let url = await Url.findOne({ urlCode: req.params.urlCode });
    if (!url) {
      next();
    }
    url.timesUsed = url.timesUsed + 1;
    await Url.findByIdAndUpdate(url.id, url, { useFindAndModify: false });

    res.redirect(url.originalUrl);
  } catch (error) {
    next();
  }
});

app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`url-shortener running on ${PORT}`);
});
