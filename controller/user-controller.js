const express = require("express");
const router = express.Router();
const User = require("../models/Usuario");
const cloudinary = require("cloudinary").v2;
const fileupload = require("express-fileupload");

const setUser = async (req, res) => {
  const { logo, name, email, password, numero, site, user } = req.body;
  try {
    console.log(logo);
    const result = await cloudinary.uploader.upload(logo, {
      folder: "tamarin-companies",
      resource_type: "auto",
    });

    let UserArray = [];
    let ProdutoArray = [];
    let PedidosArray = [];
    let OrcamentoArray = [];
    let MessageArray = [];

    const newUser = new User({
      logo: result.url,
      logo_id: result._id,
      name: name,
      email: email,
      password: password,
      number: numero,
      site: site,
      users: user,
      produto: ProdutoArray,
      pedidos: PedidosArray,
      orcamento: OrcamentoArray,
      message: MessageArray,
    });
    newUser.save((err, message) => {
      if (err) console.log(err);
      console.log(message);
    });
  } catch (error) {
    console.log(error);
  }
};

const getUser = (req, res) => {
  let { email, password } = req.body;

  User.find({ email: email, password: password })
    .then((response) => {
      res.send(response);
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

const deleteUser = (req, res) => {
  const { id } = req.body;
  User.deleteOne({ _id: id })
    .then((response) => {
      res.send(response);
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

const getEmpresa = (req, res) => {
  const id = req.params.id;
  User.findOne({ _id: req.params.id })
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  setUser,
  getUser,
  deleteUser,
  getEmpresa,
};
