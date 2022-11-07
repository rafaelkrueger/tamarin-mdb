const mongoose = require("mongoose");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

module.exports = async function conn() {
  await mongoose
    .connect(
      `mongodb+srv://rafaelkrueger:Vidanormal01@tamarin.3bbedo7.mongodb.net/?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("Banco conectado!");
    })
    .catch((err) => {
      console.log(err.message);
    });
};
