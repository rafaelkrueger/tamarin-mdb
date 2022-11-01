const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https");

// const cert = fs.readFileSync(
//   path.resolve(__dirname, `./certs/${process.env.GN_CERT_PROD}`)
// );

// const agent = new https.Agent({
//   pfx: cert,
//   passphrase: "",
// });

// const credentials = Buffer.from(
//   process.env.GN_CLIENT_ID + ":" + process.env.GN_CLIENT_SECRET
// ).toString("base64");

// const pix = async (req, res) => {
//   const authResponse = await axios({
//     method: "POST",
//     url: `${process.env.GN_ENDPOINT}/oauth/token`,
//     headers: {
//       Authorization: `Basic ${credentials}`,
//       "Content-Type": "application/json",
//     },
//     httpsAgent: agent,
//     data: {
//       grant_type: "client_credentials",
//     },
//   });
// };

// const creditCard = (req, res) => {};

// module.exports = {
//   pix,
//   creditCard,
// };
