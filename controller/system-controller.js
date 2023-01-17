const express = require("express");
const router = express.Router();
const axios = require("axios");
const Message = require("../models/message");

const home = (req, res) => {
  res.send("funcionando");
};

const news = (req, res) => {
  const { search } = req.params;
  const news = `https://newsapi.org/v2/everything?q=${search}&apiKey=fdbb0b23c7fe482b9a98a00908ab4f98`;

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
