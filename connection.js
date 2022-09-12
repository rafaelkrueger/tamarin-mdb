const mongoose = require("mongoose");



module.exports = async function conn(){
  await mongoose.connect("mongodb+srv://rafaelkrueger:Vidanormal01@tamarin.3bbedo7.mongodb.net/?retryWrites=true&w=majority",
    {useNewUrlParser: true, 
        useUnifiedTopology: true}).then(()=>{
        console.log("Banco conectado!")
    }).catch((err)=>{
        console.log(err.message)
    })

} 
