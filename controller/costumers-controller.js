const express = require("express");
const router = express.Router();
const User = require("../models/Usuario");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const fileupload = require("express-fileupload");

const findCostumer = async (req, res) => {
  const { empresa, email, password } = req.body;

  const costumerExists = await User.findOne({
    _id: empresa,
    "users.email": email,
    "users.password": password,
  });
  if (costumerExists) {
    res.send("logado");
  } else {
    res.send("");
  }
};

const createCostumer = async (req, res) => {
  const { empresa, name, email, cpf, password, number } = req.body;
  const emptyCart = [];
  const emptyWishList = [];
  const emptyProducts = [];

  const costumerExists = await User.find({
    _id: empresa,
    "users.email": email,
  });
  if (costumerExists.length == 0) {
    User.updateOne(
      { _id: empresa },
      {
        $addToSet: {
          users: {
            _id: mongoose.Types.ObjectId(),
            profileImage: "empty",
            name: name,
            email: email,
            cpf: cpf,
            password: password,
            number: number,
            cep: "",
            state: "",
            city: "",
            hood: "",
            street: "",
            streetNumber: "",
            savedCart: emptyCart,
            wishList: emptyWishList,
            myPurchase: emptyProducts,
          },
        },
      }
    )
      .then((response) => res.send("Usuário criado com sucesso!"))
      .catch((err) => console.log(err));
  } else {
    res.send("Erro: usuário já existente!");
  }
};

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
  deleteCostumer,
  createCostumer,
  findCostumer,
};
