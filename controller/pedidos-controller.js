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

const setTrackCode = async (req, res) => {
  const { empresa, id, trackcode } = req.body;

  User.updateOne(
    { _id: empresa, "pedidos._id": id },
    { $set: { "pedidos.$.trackcode": trackcode } }
  )
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

const getPedidoStatus = (req, res) => {
  const { id, empresa } = req.params;

  User.findOne({ _id: empresa, "pedidos._id": id })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  patchPedido,
  setTrackCode,
  getPedidoStatus,
};
