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
  city,
  street,
  streetNumber,
  valor,
  products
) => {
  const orderId = mongoose.Types.ObjectId();
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
          products: products,
          valorTotal: valor,
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
  const cobId = cobResponse.data.txid;
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
    city,
    street,
    streetNumber,
    valor,
    products
  );
  res.end(
    JSON.stringify({ qrcode: qrcodeResponse.data.imagemQrcode, txid: cobId })
  );
};

const verifyPix = async (req, res) => {
  const cobId = req.params.txid;
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
  let validation = "";
  const interval = setInterval(async () => {
    await reqGN
      .get(`/v2/cob/${cobId}`)
      .then((response) => {
        if (response.data.status === "CONCLUIDA") {
          console.log(response.data.status);
          validation = "CONCLUIDA";
          clearInterval(interval);
          res.end(validation);
        }
      })
      .catch((err) => console.log(err));
  }, 2000);
};

const boleto = async (req, res) => {
  // const {
  //   empresa,
  //   name,
  //   email,
  //   cpf,
  //   password,
  //   number,
  //   cep,
  //   state,
  //   hood,
  //   city,
  //   street,
  //   streetNumber,
  //   valor,
  //   products,
  //   birth,
  //   shipping,
  // } = req.body;
  // const options = {
  //   client_id: process.env.GN_CLIENT_ID,
  //   client_secret: process.env.GN_CLIENT_SECRET,
  //   sandbox: false,
  // };
  // const body = {
  //   payment: {
  //     banking_billet: {
  //       expire_at: "2023-01-15",
  //       customer: {
  //         name: name,
  //         email: email,
  //         cpf: cpf,
  //         birth: "2002-11-25",
  //         phone_number: number,
  //       },
  //     },
  //   },
  //   items: [
  //     {
  //       name: "Camiseta",
  //       value: 2000,
  //       amount: 2,
  //     },
  //   ],
  //   shippings: [
  //     {
  //       name: "Default Shipping Cost",
  //       value: 1000,
  //     },
  //   ],
  // };
  // var gerencianet = new Gerencianet(options);
  // gerencianet
  //   .createOneStepCharge([], body)
  //   .then((response) => res.send(response))
  //   .catch((err) => console.log(err.data.error_description));
  // await insertPayment(
  //   empresa,
  //   name,
  //   email,
  //   cpf,
  //   password,
  //   number,
  //   cep,
  //   state,
  //   hood,
  //   city,
  //   street,
  //   streetNumber,
  //   valor,
  //   products
  // );
};

const cardPayment = async (req, res) => {
  const { name, amount, id } = req.body;

  try {
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "BRL",
      description: name,
      payment_method: "card",
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
  verifyPix,
  cardPayment,
};
