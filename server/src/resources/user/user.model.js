const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  login: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: String,
  avatar: String,
  name: String,
  surname: String,
  age: Number,
  gender: String,
  weight_kg: Number,
  height_cm: Number,
  isVerified: {
    type: Boolean,
    default: false,
  },
  googleId: String,
  facebookId: String,
});

// hooks
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.password = hash;
    next();
  });
});

// methods
userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) return reject(err);
      resolve(same);
    });
  });
};

const User = mongoose.model("user", userSchema);

module.exports = User;
