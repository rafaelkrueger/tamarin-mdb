require("dotenv").config();
const User = require("../models/Usuario");
const { insertOrder } = require("../services/pedidos-services");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https");
const mongoose = require("mongoose");
const Gerencianet = require("gn-api-sdk-node");
const stripe = require("stripe")(process.env.SK_LIVE_KEY);

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
    products,
    valor,
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
  await insertOrder(
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
  const {
    name,
    email,
    cpf,
    number,
    empresa,
    password,
    cep,
    state,
    city,
    street,
    streetNumber,
    products,
    valor,
  } = req.body;
  const options = {
    client_id: process.env.GN_CLIENT_ID,
    client_secret: process.env.GN_CLIENT_SECRET,
    sandbox: false,
  };
  console.log(valor);
  var chargeInput = {
    items: [
      {
        name: "Compra Online",
        value: valor * 100,
        amount: 1,
      },
    ],
    payment: {
      banking_billet: {
        expire_at: "2023-01-25",
        customer: {
          name: name,
          email: email,
          cpf: cpf,
          phone_number: number,
        },
      },
    },
  };
  await insertOrder(
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

  var gerencianet = new Gerencianet(options);
  gerencianet
    .createOneStepCharge([], chargeInput)
    .then((response) => console.log("boleto enviado!"))
    .catch((err) => console.log(err.data));
};

const cardPayment = async (req, res) => {
  try {
    const {
      amount,
      number,
      expMonth,
      expYear,
      cardNumber,
      cvc,
      name,
      email,
      cpf,
      empresa,
      password,
      cep,
      state,
      city,
      street,
      streetNumber,
      products,
      valor,
    } = req.body;
    await stripe.tokens.create(
      {
        card: {
          number: cardNumber,
          exp_month: expMonth,
          exp_year: expYear,
          cvc: cvc,
        },
      },
      async (err, token) => {
        const charge = await stripe.charges.create({
          amount: amount * 100,
          currency: "BRL",
          source: token.id,
          description: "tamarintec@gmail.com",
        });
        await insertOrder(
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
        res.json({ status: "success", charge: charge.receipt_url });
      }
    );
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

module.exports = {
  getPix,
  boleto,
  verifyPix,
  cardPayment,
};
