const User = require("../models/Usuario");

const setCupom = async (req, res) => {
  try {
    const { empresa, code, avaible } = req.body;
    let percentage = req.body.percentage;
    percentage = percentage * 0.1;
    User.updateOne(
      { _id: empresa },
      {
        $addToSet: {
          cupom: {
            code: code,
            percentage: percentage,
            avaible: avaible,
          },
        },
      }
    )
      .then((response) => res.send(response + " - Alterado com sucesso!"))
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};

const getCupom = async (req, res) => {
  const { empresa, code } = req.params;
  await User.findOne({
    _id: empresa,
    "cupom.$.code": code,
  })
    .then((response) => {
      const rightCupom = response.cupom.filter((list) => {
        return list.code === code;
      });
      res.send(rightCupom);
    })
    .catch((err) => {
      console.log(err);
    });
};

const removeCupom = (req, res) => {
  const { empresa, id } = req.body;
  User.updateOne(
    { _id: empresa, "cupom.$._id": id },
    { $pull: { cupom: { _id: id } } }
  )
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  setCupom: setCupom,
  getCupom: getCupom,
  removeCupom: removeCupom,
};
