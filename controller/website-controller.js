const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../models/Usuario");

const setWebsiteStyle = (req, res) => {
  try {
    const { productId, product, description, category, value, image } =
      req.body;
    User.updateOne(
      { "produto._id": productId },
      {
        $set: {
          "produto.$.product": product,
          "produto.$.description": description,
          "produto.$.category": category,
          "produto.$.value": value,
        },
      }
    )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  setWebsiteStyle,
};
