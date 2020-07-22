require("dotenv").config();
const express = require("express");
const DBconnect = require("./util/DBconnect");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const urlRoutes = require("./routes/url");
const cookierParser = require("cookie-parser");
const cors = require("cors");
const Url = require("./models/Url");

DBconnect(process.env.MONGO_URI);

const app = express();

app.use(express.json());
app.use(cookierParser());
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes);

// @desc Read and redirect to original-url
// @route GET /:urlCode
// @access Public
app.use("/:urlCode", async (req, res) => {
  try {
    let url = await Url.findOne({ urlCode: req.params.urlCode });
    if (!url) {
      res.redirect(process.env.BASE_URL + "invalid-url");
      return;
    }
    url.timesUsed = url.timesUsed + 1;
    await Url.findByIdAndUpdate(url.id, url, { useFindAndModify: false });

    res.redirect(url.originalUrl);
  } catch (error) {
    res.redirect(process.env.BASE_URL + "invalid-url");
    return;
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`url-shortener running on ${PORT}`);
});
