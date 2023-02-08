const User = require("../models/Usuario");
const cloudinary = require("cloudinary").v2;
const fileupload = require("express-fileupload");
const { IgApiClient } = require("instagram-private-api");
const { get } = require("request-promise");

const setCategoria = (req, res) => {
  const { empresa, category } = req.body;
  User.updateOne({ _id: empresa }, { $addToSet: { categorias: category } })
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

const deleteCategoria = (req, res) => {
  const { empresa, category } = req.body;
  User.updateOne({ _id: empresa }, { $pull: { categorias: category } })
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

const setProduto = async (req, res) => {
  try {
    const {
      empresa,
      product,
      description,
      category,
      value,
      image,
      options,
      avaible,
      subImages,
      discount,
      instaUsername,
      instaPassword,
      publish,
    } = req.body;

    const result =
      image.charAt(0) != "h"
        ? await cloudinary.uploader.upload(image, {
            folder: "samples",
            resource_type: "auto",
          })
        : image;

    const sub1 = subImages.subI1
      ? await cloudinary.uploader.upload(subImages.subI1, {
          folder: "samples",
          resource_type: "auto",
        })
      : "";

    const sub2 = subImages.subI2
      ? await cloudinary.uploader.upload(subImages.subI2, {
          folder: "samples",
          resource_type: "auto",
        })
      : "";

    const sub3 = subImages.subI3
      ? await cloudinary.uploader.upload(subImages.subI3, {
          folder: "samples",
          resource_type: "auto",
        })
      : "";

    const sub4 = subImages.subI4
      ? await cloudinary.uploader.upload(subImages.subI4, {
          folder: "samples",
          resource_type: "auto",
        })
      : "";

    const postToInsta = async () => {
      const ig = new IgApiClient();
      ig.state.generateDevice(instaUsername);
      await ig.account.login(instaUsername, instaPassword);
      const imageBuffer = await get({
        url: result.secure_url,
        encoding: null,
      });
      await ig.publish.photo({
        file: imageBuffer,
        caption: description,
      });
      await ig.publish.story({
        file: imageBuffer,
        caption: description,
      });
    };
    if (publish) {
      await postToInsta();
    }

    User.updateOne(
      { _id: empresa },
      {
        $addToSet: {
          produto: {
            product: product,
            description: description,
            category: category,
            value: value,
            options: options,
            image: image.charAt(0) != "h" ? result.secure_url : result,
            subImages: {
              subImage1: sub1.secure_url,
              subImage2: sub2.secure_url,
              subImage3: sub3.secure_url,
              subImage4: sub4.secure_url,
            },
            public_id: result.public_id,
            sold: 0,
            rating: 0,
            avaible: avaible,
            discount: discount,
            comments: [],
          },
        },
      }
    )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};

const updateProduto = async (req, res) => {
  try {
    const { productId, product, description, category, value, image } =
      req.body;
    User.updateOne(
      { "produto._id": productId },
      {
        $set: {
          "produto.$.product": product,
          "produto.$.description": description,
          "produto.$.category": category,
          "produto.$.value": value,
        },
      }
    )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};

const deleteProduto = async (req, res) => {
  const { empresa, nomeProduto } = req.body;
  User.updateOne(
    { _id: empresa },
    { $pull: { produto: { product: nomeProduto } } }
  )
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

const setProdutoComment = async (req, res) => {
  const {
    empresa,
    name,
    productId,
    imageComment,
    image,
    title,
    comment,
    rating,
  } = req.body;

  const result =
    image.charAt(0) != "h"
      ? await cloudinary.uploader.upload(imageComment, {
          folder: "samples",
          resource_type: "auto",
        })
      : image;

  User.updateOne(
    { _id: empresa, "produto._id": productId },
    {
      $addToSet: {
        "produto.$.comments": {
          image: image.charAt(0) == "h" ? image : "",
          imageComment: result.charAt(0) == "h" ? result.secure_url : "",
          name: name,
          title: title,
          comment: comment,
          rating: rating,
          reviewd: "true",
        },
      },
    }
  )
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};

module.exports = {
  setCategoria,
  deleteCategoria,
  setProduto,
  updateProduto,
  deleteProduto,
  setProdutoComment,
};
