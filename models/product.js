const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: true,
      maxLength: 32,
    },
    description: {
      type: String,
      require: true,
      maxLength: 2000,
    },
    price: {
      type: Number,
      trim: true,
      require: true,
      maxLength: 32,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      //required: true,
    },
    quanity: {
      type: Number,
      // required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    shipping: {
      require: false,
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
