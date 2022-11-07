const express = require("express");
const router = express.Router();
const User = require("../models/Usuario");
const cloudinary = require("cloudinary").v2;
const fileupload = require("express-fileupload");

const setCategoria = (req, res) => {
  const { empresa, category } = req.body;
  User.updateOne({ _id: empresa }, { $addToSet: { categorias: category } })
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

const deleteCategoria = (req, res) => {
  const { empresa, category } = req.body;
  User.updateOne({ _id: empresa }, { $pull: { categorias: category } })
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

const setProduto = async (req, res) => {
  try {
    const { empresa, product, description, category, value, image } = req.body;
    const result = await cloudinary.uploader.upload(image, {
      folder: "samples",
      resource_type: "auto",
    });
    console.log(result);
    User.updateOne(
      { _id: empresa },
      {
        $addToSet: {
          produto: {
            product: product,
            description: description,
            category: category,
            value: value,
            image: result.secure_url,
            public_id: result.public_id,
          },
        },
      }
    )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};

const updateProduto = async (req, res) => {
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

const deleteProduto = async (req, res) => {
  const { empresa, nomeProduto } = req.body;
  User.updateOne(
    { _id: empresa },
    { $pull: { produto: { product: nomeProduto } } }
  )
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  setCategoria,
  deleteCategoria,
  setProduto,
  updateProduto,
  deleteProduto,
};
