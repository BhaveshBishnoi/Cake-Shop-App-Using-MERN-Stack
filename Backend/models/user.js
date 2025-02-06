const mongoose = require("mongoose");

const user = new mongoose.Schema(
  {
    username: {
      type: String,
      requried: true,
      unique: true,
    },
    email: {
      type: String,
      requried: true,
      unique: true,
    },
    password: {
      type: String,
      requried: true,
    },
    address: {
      type: String,
      requried: true,
    },
    avtar: {
      type: String,
      default:
        "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg",
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    favourites: [{ type: mongoose.Types.ObjectId, ref: "cake" }],
    cart: [{ type: mongoose.Types.ObjectId, ref: "cake" }],
    orders: [{ type: mongoose.Types.ObjectId, ref: "order" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", user);
