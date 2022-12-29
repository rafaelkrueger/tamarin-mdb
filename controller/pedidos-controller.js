require("dotenv").config();
const User = require("../models/Usuario");
const axios = require("axios");

const patchPedido = async (req, res) => {
  const { empresa, id } = req.body;

  User.updateOne({ _id: empresa }, { $pull: { pedidos: { _id: id } } })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  patchPedido,
};
