const express = require("express");
const router = express.Router();
const axios = require("axios");
const Message = require("../models/message");
const stripe = require("stripe")(
  "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"
);

const home = (req, res) => {
  res.send("funcionando");
};

const news = (req, res) => {
  const newsPesquisa = "programming";
  const news = `https://newsapi.org/v2/everything?q=${newsPesquisa}&apiKey=fdbb0b23c7fe482b9a98a00908ab4f98`;

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
  setMessage,
};
