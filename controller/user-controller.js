const express = require("express");
const router = express.Router();
const User = require("../models/Usuario");
const cloudinary = require("cloudinary").v2;
const fileupload = require("express-fileupload");
const deepai = require("deepai");

const setUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      numero,
      site,
      user,
      logo,
      instaUsername,
      instaPassword,
    } = req.body;
    const result = await cloudinary.uploader.upload(logo, {
      folder: "tamarin-companies",
      resource_type: "auto",
    });

    let UserArray = [];
    let ProdutoArray = [];
    let PedidosArray = [];
    let OrcamentoArray = [];
    let MessageArray = [];
    let cupomArray = [];
    const newUser = new User({
      logo: result.url,
      logo_id: result._id,
      name: name,
      email: email,
      password: password,
      number: numero,
      site: site,
      users: UserArray,
      produto: ProdutoArray,
      pedidos: PedidosArray,
      orcamento: OrcamentoArray,
      message: MessageArray,
      social: {
        instaUsername: instaUsername,
        instaPassword: instaPassword,
      },
      website: {
        websiteNavbarFooterColor: "black",
        websiteFontFooterColor: "white",
        websiteColor: "white",
        websiteFontColor: "black",
        websiteCarousel: "",
      },
      cupom: cupomArray,
    });
    newUser.save((err, message) => {
      if (err) console.log(err);
      console.log(message);
    });
  } catch (error) {
    console.log(error);
  }
};

const getUser = (req, res) => {
  let { email, password } = req.body;

  User.find({ email: email, password: password })
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

const allUsers = (req, res) => {
  User.find()
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

const updateUser = async (req, res) => {
  const { id, logo, name, email, password } = req.body;

  const result = async () => {
    if (logo.charAt(0) == "h") {
      return logo;
    } else {
      const result = await cloudinary.uploader.upload(logo, {
        folder: "samples",
        resource_type: "auto",
      });
      return result;
    }
  };
  const resultImage = await result();
  User.updateOne(
    { _id: id },
    {
      name: name,
      email: email,
      password: password,
      logo: logo.charAt(0) == "h" ? resultImage : resultImage.secure_url,
    }
  )
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

const deleteUser = (req, res) => {
  const { id } = req.body;
  User.deleteOne({ _id: id })
    .then((response) => {
      res.send(response);
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

const createUserLogo = async (req, res) => {
  deepai.setApiKey("quickstart-QUdJIGlzIGNvbWluZy4uLi4K");
  const newLogo = req.body.name;

  var resp = await deepai.callStandardApi("logo-generator", {
    text: newLogo,
  });
  res.send(resp.output_url);
};

const getEmpresa = (req, res) => {
  User.findOne({ site: req.params.site })
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  setUser,
  getUser,
  allUsers,
  updateUser,
  deleteUser,
  createUserLogo,
  getEmpresa,
};
