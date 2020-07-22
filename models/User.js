const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please enter your fullname"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email ID"],
    unique: [true, "Email already exist"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
    immutable: [true, "Email cannot be changed"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    match: [/[^-\s]/, "Password cannot have space"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    immutable: true,
  },
  urlId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
    },
  ],
});

// Encrpyt password everytime before a document is saved (only if field 'password' is changed)
User.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hashSync(this.password, 10);
  }
  next();
});

// Create signedJWTToken and return
User.methods.getSignedJWTToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2d",
    }
  );
};

module.exports = mongoose.model("User", User);
