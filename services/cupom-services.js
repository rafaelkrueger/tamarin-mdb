const mongoose = require("mongoose");
const User = require("../models/Usuario");

const subtractCupom = async (empresa, id, avaible) => {
  User.updateOne(
    { _id: empresa, "cupom._id": id },
    {
      $set: {
        "cupom.$.avaible": avaible - 1,
      },
    }
  );
};

module.exports = {
  subtractCupom: subtractCupom,
};
