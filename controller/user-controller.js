const express = require("express");
const router = express.Router();
const User = require("../models/Usuario");
const cloudinary = require("cloudinary").v2;
const fileupload = require("express-fileupload");

const setUser = async (req, res) => {
  try {
    const { name, tagName, email, password, numero, site, user, logo } =
      req.body;
    const result = await cloudinary.uploader.upload(logo, {
      folder: "tamarin-companies",
      resource_type: "auto",
    });

    let UserArray = [];
    let ProdutoArray = [];
    let PedidosArray = [];
    let OrcamentoArray = [];
    let MessageArray = [];
    let SocialArray = [];

    const newUser = new User({
      logo: result.url,
      logo_id: result._id,
      name: name,
      tagName: tagName,
      email: email,
      password: password,
      number: numero,
      site: site,
      users: UserArray,
      social: SocialArray,
      produto: ProdutoArray,
      pedidos: PedidosArray,
      orcamento: OrcamentoArray,
      message: MessageArray,
      website: {
        websiteNavbarFooterColor: "black",
        websiteFontFooterColor: "white",
        websiteColor: "white",
        websiteFontColor: "black",
        websiteCarousel: "",
      },
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

const getEmpresa = (req, res) => {
  User.findOne({ _id: req.params.id })
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
  getEmpresa,
};
