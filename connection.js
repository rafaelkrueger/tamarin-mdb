const mongoose = require("mongoose");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

module.exports = async function conn() {
  await mongoose
    .connect(`${process.env.DB}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Banco conectado!");
    })
    .catch((err) => {
      console.log(err.message);
    });
};
