require("dotenv").config();
const User = require("../models/Usuario");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https");
const mongoose = require("mongoose");
const Gerencianet = require("gn-api-sdk-node");
const stripe = require("stripe")(process.env.SK_LIVE_KEY);

insertPayment = async (
  empresa,
  name,
  email,
  cpf,
  password,
  number,
  cep,
  state,
  hood,
  city,
  street,
  streetNumber,
  valor,
  products
) => {
  const emptyCart = [];
  const emptyWishList = [];
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
          cep: cep,
          state: state,
          city: city,
          hood: hood,
          street: street,
          streetNumber: streetNumber,
          savedCart: emptyCart,
          wishList: emptyWishList,
          myPurchase: products,
        },
        pedidos: {
          _id: mongoose.Types.ObjectId(),
          name: name,
          email: email,
          cpf: cpf,
          number: number,
          cep: cep,
          state: state,
          city: city,
          hood: hood,
          street: street,
          streetNumber: streetNumber,
          products: products,
          valorTotal: valor,
        },
      },
    }
  )
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};

const cert = fs.readFileSync(
  path.resolve(__dirname, `../certs/${process.env.GN_CERT_PROD}`)
);

const agent = new https.Agent({
  pfx: cert,
  passphrase: "",
});

const credentials = Buffer.from(
  process.env.GN_CLIENT_ID + ":" + process.env.GN_CLIENT_SECRET
).toString("base64");

const getPix = async (req, res) => {
  const {
    empresa,
    name,
    email,
    cpf,
    password,
    number,
    cep,
    state,
    hood,
    city,
    street,
    streetNumber,
    valor,
    products,
  } = req.body;
  const authResponse = await axios({
    method: "POST",
    url: `${process.env.GN_ENDPOINT}/oauth/token`,
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    httpsAgent: agent,
    data: {
      grant_type: "client_credentials",
    },
  });

  const accessToken = await authResponse.data?.access_token;

  const reqGN = axios.create({
    baseURL: process.env.GN_ENDPOINT,
    httpsAgent: agent,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  const dataCob = {
    calendario: {
      expiracao: 3600,
    },
    valor: {
      original: `${parseFloat(valor).toFixed(2)}`,
    },
    chave: "de5d1466-f483-4911-839e-4ab70227dec6",
    solicitacaoPagador: "Cobrança",
  };

  const cobResponse = await reqGN.post(`/v2/cob`, dataCob).catch((err) => {
    console.log(err);
  });
  const qrcodeResponse = await reqGN
    .get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`)
    .catch((err) => console.log(err));
  await insertPayment(
    empresa,
    name,
    email,
    cpf,
    password,
    number,
    cep,
    state,
    hood,
    city,
    street,
    streetNumber,
    valor,
    products
  );
  res.send(qrcodeResponse.data.imagemQrcode);
};

const boleto = async (req, res) => {
  const {
    empresa,
    name,
    email,
    cpf,
    password,
    number,
    cep,
    state,
    hood,
    city,
    street,
    streetNumber,
    valor,
    products,
    birth,
    shipping,
  } = req.body;
  //   const options = {
  //     client_id: process.env.GN_CLIENT_ID,
  //     client_secret: process.env.GN_CLIENT_SECRET,
  //     sandbox: false,
  //   };
  //   const body = {
  //     payment: {
  //       banking_billet: {
  //         expire_at: "2023-01-5",
  //         customer: {
  //           name: name,
  //           email: email,
  //           cpf: cpf,
  //           birth: "2002-11-25",
  //           phone_number: number,
  //         },
  //       },
  //     },
  //     items: [
  //       {
  //         name: "Camiseta",
  //         value: 2000,
  //         amount: 2,
  //       },
  //     ],
  //     shippings: [
  //       {
  //         name: "Default Shipping Cost",
  //         value: 1000,
  //       },
  //     ],
  //   };
  //   var gerencianet = new Gerencianet(options);

  //   gerencianet
  //     .createOneStepCharge([], body)
  //     .then((res) => console.log("Boleto Enviado "))
  //     .catch((err) => res.send("Boleto Enviado"));
  await insertPayment(
    empresa,
    name,
    email,
    cpf,
    password,
    number,
    cep,
    state,
    hood,
    city,
    street,
    streetNumber,
    valor,
    products
  );
};

const creditCard = async (req, res) => {
  const { name, amount, id, cpf } = req.body;

  try {
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "BRL",
      description: name,
      payment_method: id,
      confirm: true,
    });
    console.log("Payment", payment);
    res.json({
      message: "Paymeny Success",
      success: true,
    });
  } catch (error) {
    console.log("error", error.message);
    res.json({
      message: "payment Failed",
      success: false,
    });
  }
};

module.exports = {
  getPix,
  boleto,
  creditCard,
};
