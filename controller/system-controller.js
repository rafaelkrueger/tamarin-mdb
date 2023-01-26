const express = require("express");
const router = express.Router();
const axios = require("axios");
const Message = require("../models/message");
require("dotenv").config();
const { rastrearEncomendas } = require("correios-brasil");

const home = (req, res) => {
  res.send("funcionando");
};

const news = (req, res) => {
  const { search } = req.params;
  const news = `https://newsapi.org/v2/everything?q=${search}&apiKey=${process.env.NEWS_API}`;
  axios
    .get(news)
    .then((response) => {
      res.send(JSON.stringify(response.data));
      console.log("api-acessada");
    })
    .catch((err) => {
      console.log(err);
    });
};

const correios = (req, res) => {
  const { trackCode } = req.params;
  rastrearEncomendas([trackCode])
    .then((response) => {
      res.send(response[0].eventos);
    })
    .catch((err) => {
      console.log(err);
    });
};

const peexels = (req, res) => {
  //peexels videos
  // axios({
  //   method: "get",
  //   url: `https://api.pexels.com/videos/search?query=${req.params.search}`,
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${process.env.PEEXELS_API}`,
  //   },
  // })
  //   .then((response) => {
  //     res.send(response.data);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // //peexels images
  axios({
    method: "get",
    url: `https://api.pexels.com/v1/search?query=${req.params.search}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PEEXELS_API}`,
    },
  })
    .then((response) => {
      // console.log(response.data.photos);
      // res.send(response.data.photos[Math.random() * 20].src.landscape);
    })
    .catch((error) => {
      console.log(error);
    });
};

const setMessage = (req, res) => {
  let { name, email, number, message } = req.body;
  const newMessage = new Message({
    name: name,
    email: email,
    number: number,
    message: message,
  });
  newMessage.save((err, message) => {
    if (err) console.log(err);
    console.log(message);
  });
};

module.exports = {
  home,
  news,
  peexels,
  correios,
  setMessage,
};
