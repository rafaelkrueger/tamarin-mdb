const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
//controllers
const {
  setUser,
  getUser,
  allUsers,
  updateUser,
  deleteUser,
  getEmpresa,
} = require("./controller/user-controller");
const { setMessage, home, news } = require("./controller/system-controller");
const {
  deleteProduto,
  updateProduto,
  setCategoria,
  setProduto,
  deleteCategoria,
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
const { patchPedido } = require("./controller/pedidos-controller");
const {
  deleteCostumer,
  createCostumer,
  findCostumer,
  facebookCostumer,
} = require("./controller/costumers-controller");
//connection
const conn = require("./connection");
const cloudinary = require("cloudinary").v2;
const fileupload = require("express-fileupload");
const PORT = process.env.PORT || 8080;

//Database Connection
conn();

cloudinary.config({
  cloud_name: "tamarin-tech",
  api_key: "739453756319644",
  api_secret: "vitA4c7VnVj9_5RctBDuRUhocpI",
});

//Middlewares
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(bodyParser.json({ limit: "100000mb" }));
app.use(bodyParser.urlencoded({ limit: "100000mb", extended: true }));
app.use(fileupload({ useTempFiles: true }));
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  app.use(cors());
  next();
});

//configuration
app.set("view engine", "ejs");
app.set("views", "./views");

//system routes
app.get("/", home);
app.post("/set-message", setMessage);
app.get("/news", news);

//user access routes
app.get("/empresa/:site", getEmpresa);
app.post("/set-user", setUser);
app.post("/get-user", getUser);
app.get("/all", allUsers);
app.patch("/update-user", updateUser);
app.post("/delete-user", deleteUser);

//costumers access rooutes
app.post("/find-costumer", findCostumer);
app.post("/create-costumer", createCostumer);
app.patch("/delete-costumer", deleteCostumer);
app.post("/facebook-costumer", facebookCostumer);

//products handler routes
app.post("/set-categoria", setCategoria);
app.post("/delete-categoria", deleteCategoria);
app.post("/set-produto", setProduto);
app.patch("/update-produto", updateProduto);
app.post("/delete-produto", deleteProduto);

//website handler routes
app.patch("/website-style", setWebsiteAllStyle);
app.patch("/website-card-style", setWebsiteCardStyle);
app.patch("/website-details-style", setWebsiteDetailsStyle);

//payment handler routes
app.post("/pix", getPix);
app.get("/pix-status/:txid", verifyPix);
app.post("/boleto", boleto);
app.post("/card-payment", cardPayment);

//pedidos handler routes
app.patch("/pedido-entregue", patchPedido);

app.listen(PORT, () => {
  console.log("Funcionando na porta: " + PORT);
});
