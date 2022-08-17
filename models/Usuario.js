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
    cardapio:Array,
    pedidos:Array,
    orcamento:Array,
    message:Array
})

const User = mongoose.model('user', userSchema)

module.exports = User
