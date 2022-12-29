const express = require("express");
const router = express.Router();
const User = require("../models/Usuario");
const cloudinary = require("cloudinary").v2;
const fileupload = require("express-fileupload");

const deleteCostumer = async (req, res) => {
  const { empresa, id } = req.body;
  console.log(empresa);
  console.log(id);
  User.updateOne({ _id: empresa }, { $pull: { users: { _id: id } } })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  deleteCostumer: deleteCostumer,
};
