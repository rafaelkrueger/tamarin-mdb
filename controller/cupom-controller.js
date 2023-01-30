const User = require("../models/Usuario");

const setCupom = (req, res) => {
  try {
    const { empresa, code, percentage, avaible } = req.body;

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
  res.send("working on it");
  //   const { empresa, code } = req.params;
  //   await User.findOne({
  //     _id: empresa,
  //     "cupom.$.code": code,
  //   })
  //     .then((response) => {
  //       if (response) {
  //         for (const cupom of response.cupom) {
  //           if (cupom.avaible == 0) {
  //             User.updateOne(
  //               { _id: empresa, "cupom.$._id": cupom._id },
  //               { $pull: { cupom: { _id: cupom._id } } }
  //             );
  //           }
  //           if (cupom.code == code) {
  //             const percentage = JSON.stringify({ percentage: cupom.percentage });
  //             if (cupom.code == code) {
  //               cupom.avaible = cupom.avaible - 1;
  //               User.updateOne(
  //                 { _id: empresa, "cupom.$._id": cupom._id },
  //                 { $pull: { cupom: { avaible: cupom.avaible } } }
  //               );
  //             }
  //             res.send(percentage);
  //           }
  //         }
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
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
