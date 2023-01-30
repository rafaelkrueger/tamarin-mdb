const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  logo: String,
  logo_id: String,
  name: String,
  password: String,
  email: String,
  number: String,
  site: String,
  users: [
    {
      _id: Schema.ObjectId,
      profileImage: String,
      name: String,
      email: String,
      cpf: String,
      password: String,
      number: String,
      cep: String,
      state: String,
      city: String,
      hood: String,
      street: String,
      streetNumber: String,
      savedCart: Array,
      wishList: Array,
      myPurchase: Array,
    },
  ],
  categorias: Array,
  social: {
    instaUsername: String,
    instaPassword: String,
    faceUsername: String,
    facePassword: String,
  },
  produto: [
    {
      product: String,
      description: String,
      category: String,
      value: Number,
      options: Array,
      image: String,
      subImages: {
        subImage1: String,
        subImage2: String,
        subImage3: String,
        subImage4: String,
      },
      public_id: String,
      sold: Number,
      avaible: Number,
      rating: Number,
      discount: Number,
      comments: [
        {
          image: String,
          name: String,
          title: String,
          comment: String,
          rating: Number,
          reviewd: String,
        },
      ],
    },
  ],
  pedidos: [
    {
      _id: Schema.ObjectId,
      name: String,
      email: String,
      cpf: String,
      number: String,
      cep: String,
      state: String,
      city: String,
      hood: String,
      street: String,
      streetNumber: String,
      products: Array,
      valorTotal: Number,
      trackcode: String,
      status: String,
    },
  ],
  orcamento: Array,
  message: Array,
  website: {
    websiteNavbarFooterColor: String,
    websiteFontFooterColor: String,
    websiteColor: String,
    websiteFontColor: String,
    websiteCarousel: String,

    websiteCardBackgroundColor: String,
    websiteCardFontColor: String,
    websiteDiscountColor: String,
    websitePriceColor: String,
    websiteHeartTagColor: String,
    websiteDiscountTagColor: String,
    websiteButton: String,
    websiteButtonFont: String,

    websiteDetailedBackground: String,
    websiteDetailedFont: String,
    websiteDetailedTitleFont: String,
    websiteDetailedDescriptionFont: String,
    websiteDetailedOptionsColor: String,
    websiteDetailedOptionsFont: String,
    websiteDetailedDiscountColor: String,
    websiteDetailedPriceColor: String,
    websiteDetailedHeartColor: String,
    websiteDetailedButtonBuy: String,
    websiteDetailedButtonFontBuy: String,
    websiteDetailedButtonCart: String,
    websiteDetailedButtonFontCart: String,
  },
  cupom: [
    {
      code: String,
      percentage: Number,
      avaible: Number,
    },
  ],
});

const User = mongoose.model("user", userSchema);

module.exports = User;

/*
{{
    "_id": {
        "$oid": "6300f4fcba84b45771d53e83"
    },
    "logo": "",
    "name": "Tamarin Technologies",
    "password": "Vidanormal01@",
    "email": "rafaelkrueger@gmail.com",
    "site": "https://www.google.com/search?q=tamarin-tech%40gmail.com&rlz=1C1GCEA_enBR982BR982&oq=tamarin-tech%40gmail.com&aqs=chrome..69i57j69i58.4448j1j4&sourceid=chrome&ie=UTF-8",
    "users": ["rafaelkrueger"],

    "cardapio":[],
    "pedidos": [{
        "id":1,
        "produto": "almondega",
        "value": "50.00",
        "description": "amondega para paladares sofisticados com aroma de loro",
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLJvZVsfQi36jVEVfVL9RP95PfVpYGxZdQ5rkAgWtkpQ&s",
        "cliente": {
            "nome": "osvaldo",
            "rua": "monte carlo 145",
            "bairro": "euroville",
            "horas": "20:06 - 19/08/2022",
            "pagamento": "dinheiro"
        }
    }],
    "orcamento": [],
    "message": [],
    "__v": {
        "$numberInt": "0"
    }
}
*/
