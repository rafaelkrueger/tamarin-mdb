const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
//models
const Message = require("./models/message");
const User = require("./models/Usuario");
//controllers

const {
  setUser,
  getUser,
  deleteUser,
  getEmpresa,
} = require("./controller/user-controller");
const { setMessage, home, news } = require("./controller/system-controller");

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
app.use(bodyParser.json({ limit: "1000mb" }));
app.use(bodyParser.urlencoded({ limit: "1000mb", extended: true }));
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
app.post("/set-user", setUser);
app.post("/get-user", getUser);
app.post("/delete-user", deleteUser);
app.get("/empresa/:id", getEmpresa);

app.listen(PORT, () => {
  console.log("Funcionando na porta: " + PORT);
});
