const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    _id:Schema.ObjectId,
    logo:String,
    name:String,
    password:String,
    email:String,
    number:String,
    site:String,
    users:Array,
    categorias:Array,
    produto:[{
        product:String,
        description:String, 
        category:String, 
        value:Number,
        image:{
            public_id:String,
            url:String
        }
    }],
    pedidos:Array,
    orcamento:Array,
    message:Array
})

const User = mongoose.model('user', userSchema)

module.exports = User


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