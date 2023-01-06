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
    const profile = costumerExists.users.filter((val) => {
      if (val.email == email && val.password == password) {
        return val;
      }
    });
    res.send(profile);
  } else {
    res.send("");
  }
};

const createCostumer = async (req, res) => {
  const {
    empresa,
    name,
    email,
    password,
    number,
    cpf,
    cep,
    state,
    city,
    street,
    streetNumber,
  } = req.body;
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
            number: number,
            password: password,
            cpf: cpf == undefined ? "" : cpf,
            cep: cep == undefined ? "" : cep,
            state: state == undefined ? "" : state,
            city: city == undefined ? "" : city,
            street: street == undefined ? "" : street,
            streetNumber: streetNumber == undefined ? "" : streetNumber,
            savedCart: emptyCart,
            wishList: emptyWishList,
            myPurchase: emptyProducts,
          },
        },
      }
    )
      .then((response) => res.send("success"))
      .catch((err) => console.log(err));
  } else {
    res.send("Erro: usuário com email já existente!");
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

const facebookCostumer = async (req, res) => {
  const { empresa, profileImage, email, name, number } = req.body;
  const emptyCart = [];
  const emptyWishList = [];
  const emptyProducts = [];

  const costumerExists = await User.findOne({
    _id: empresa,
    "users.email": email,
  });

  if (costumerExists) {
    const profile = costumerExists.users.filter((val) => {
      if (val.email == email) {
        return val;
      }
    });
    res.send(profile);
  } else {
    User.updateOne(
      { _id: empresa },
      {
        $addToSet: {
          users: {
            _id: mongoose.Types.ObjectId(),
            profileImage: profileImage,
            name: name,
            email: email,
            cpf: "",
            password: "",
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
  }
};

module.exports = {
  deleteCostumer,
  createCostumer,
  findCostumer,
  facebookCostumer,
};
