const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const path = require("path");
const cron = require("node-cron");
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
const { postStoriesEveryDay } = require("./cron/instagram");
//connection
const conn = require("./connection");
const cloudinary = require("cloudinary").v2;
const fileupload = require("express-fileupload");
const PORT = process.env.PORT || 8083;

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
app.use(express.static(path.join(__dirname, "views")));
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
app.get("/news/:search", news);
app.get("/peexels/:search", peexels);
app.get("/rastreio/:trackCode", correios);

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
app.post("/set-wishlist-costumer", setWishlistCostumer);
app.put("/remove-wishlist-costumer", removeWishlistCostumer);

//products handler routes
app.post("/set-categoria", setCategoria);
app.post("/delete-categoria", deleteCategoria);
app.post("/set-produto", setProduto);
app.patch("/update-produto", updateProduto);
app.post("/delete-produto", deleteProduto);
app.post("/set-produto-comment", setProdutoComment);

//cupoms handler routes
app.post("/set-cupom", setCupom);
app.get("/get-cupom/:empresa/:code", getCupom);
app.delete("/remove-cupom", removeCupom);

//website handler routes
app.patch("/website-style", setWebsiteAllStyle);
app.patch("/website-card-style", setWebsiteCardStyle);
app.patch("/website-details-style", setWebsiteDetailsStyle);

//socials handler routes
app.post("/socials/remove-instagram-followers", removeInstagramFollowers);
app.post("/socials/post-stories-every-morning", postStoriesEveryMorning);

//payment handler routes
app.post("/pix", getPix);
app.get("/pix-status/:txid", verifyPix);
app.post("/boleto", boleto);
app.post("/card-payment", cardPayment);

//pedidos handler routes
app.patch("/pedido-entregue", patchPedido);
app.post("/pedido-set-trackcode", setTrackCode);
app.get("/pedido-status/:id/:empresa", getPedidoStatus);

//cron commands to run automatically
cron.schedule("0 0 0 * * *", postStoriesEveryDay);

app.listen(PORT, () => {
  console.log("Funcionando na porta: " + PORT);
});
