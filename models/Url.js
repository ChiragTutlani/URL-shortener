const mongoose = require("mongoose");
const User = require("./User");

const Url = mongoose.Schema({
  originalUrl: {
    type: String,
    required: [true, "Please enter the url"],
    unique: [true, "URL already exist"],
    immutable: [true, "original-url cannot be changed"],
  },
  shortUrl: {
    type: String,
    required: [true, "Please enter the short-url"],
    immutable: [true, "short-url cannot be changed"],
  },
  urlCode: {
    type: String,
    required: [true, "Please enter the url-code"],
  },
  timesUsed: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    immutable: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please enter the user ID"],
  },
});

// Add document id to appropriate user when saved
Url.post("save", async function (doc) {
  const urlId = this._id;
  const userId = this.userId;

  try {
    let user = await User.findById(userId);
    user.urlId.push(urlId);

    user = await User.findByIdAndUpdate(userId, user, {
      runValidators: true,
      useFindAndModify: false,
    });
  } catch (err) {
    console.log(err);
  }
});

// Delete document id from appropriate user before deleting
Url.pre("deleteOne", { document: true }, async function (next) {
  const userId = this.userId;
  const urlId = this._id.toString();
  try {
    let user = await User.findById(userId);
    user.urlId = user.urlId.filter((id) => id.toString() !== urlId);

    await User.findByIdAndUpdate(userId, user, {
      useFindAndModify: false,
    });
  } catch (err) {
    console.log(err);
  }
  next();
});

module.exports = mongoose.model("Url", Url);
