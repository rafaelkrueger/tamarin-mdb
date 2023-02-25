const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const path = require("path");
//controllers
const {
  setUser,
  getUser,
  allUsers,
  updateUser,
  deleteUser,
  getEmpresa,
} = require("./controller/user-controller");
const {
  setMessage,
  home,
  news,
  peexels,
  correios,
} = require("./controller/system-controller");
const {
  deleteProduto,
  updateProduto,
  setCategoria,
  setProduto,
  deleteCategoria,
  setProdutoComment,
} = require("./controller/products-controller");
const {
  setWebsiteAllStyle,
  setWebsiteCardStyle,
  setWebsiteDetailsStyle,
} = require("./controller/website-controller");
const {
  getPix,
  verifyPix,
  cardPayment,
  boleto,
} = require("./controller/payment-controller");
const {
  patchPedido,
  setTrackCode,
  getPedidoStatus,
} = require("./controller/pedidos-controller");
const {
  deleteCostumer,
  createCostumer,
  findCostumer,
  facebookCostumer,
  setWishlistCostumer,
  removeWishlistCostumer,
} = require("./controller/costumers-controller");
const {
  removeInstagramFollowers,
  postStoriesEveryMorning,
} = require("./controller/socials-controller");
const {
  setCupom,
  getCupom,
  removeCupom,
} = require("./controller/cupom-controller");
//cron functions

//connection
const conn = require("./connection");
const cloudinary = require("cloudinary").v2;
const fileupload = require("express-fileupload");
const PORT = process.env.PORT || 8083;
// const PORTSOCKET = process.env.PORT || 8084;

//Database Connection
conn();

app.listen(PORT, () => {
  console.log("Funcionando na porta: " + PORT);
});
