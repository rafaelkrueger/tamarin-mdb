const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    logo:String,
    name:String,
    password:String,
    email:String,
    number:String,
    site:String,
    users:Array,
    cardapio:{
        SemAlcool:Array,
        Alcool:Array,
        Cervejas:Array,
        Bedidas:Array,
        Comidas:Array,
    },
    pedidos:Array,
    orcamento:Array,
    message:Array
})

const User = mongoose.model('user', userSchema)

module.exports = User
