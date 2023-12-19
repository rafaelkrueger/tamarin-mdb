const mongoose = require("mongoose");
const User = require("../models/Usuario");

const insertOrder = async (
  empresa,
  name,
  email,
  cpf,
  password,
  number,
  cep,
  state,
  city,
  street,
  streetNumber,
  valor,
  products
) => {
  const orderId = mongoose.Types.ObjectId();
  const currentDate = new Date();
  User.updateOne(
    { _id: empresa },
    {
      $addToSet: {
        pedidos: {
          _id: orderId,
          name: name,
          email: email,
          cpf: cpf,
          number: number,
          cep: cep,
          state: state,
          city: city,
          street: street,
          streetNumber: streetNumber,
          trackcode: "",
          products: products,
          valorTotal: valor,
        },
      },
      $addToSet: {
        orcamento: {
          _id: orderId,
          date:`${currentDate.getDay()}/${currentDate.getMonth()}/${currentDate.getYear()}`,
          quantity:valor
        },
      },
    }
  )
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
  User.updateOne(
    { _id: empresa, "users.email": email },
    {
      $addToSet: {
        "users.$.myPurchase": [
          {
            _id: orderId,
            name: name,
            email: email,
            cpf: cpf,
            number: number,
            cep: cep,
            state: state,
            city: city,
            street: street,
            streetNumber: streetNumber,
            trackcode: "",
            products: products,
            valorTotal: valor,
          },
        ],
      },
    }
  )
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  insertOrder: insertOrder,
};
