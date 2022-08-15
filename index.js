const express = require("express")
const axios = require("axios")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const mongoose = require("mongoose");
const Customer = require("./models/customer")
const Message = require("./models/message")
const PORT = process.env.PORT || 8080

//Middlewares
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*")
    app.use(cors())
    next()
})

//Database Connection
mongoose.connect("mongodb+srv://rafaelkrueger:Vidanormal01@cluster0.w2kdpw1.mongodb.net/?retryWrites=true&w=majority",
{useNewUrlParser: true, 
    useUnifiedTopology: true}).then(()=>{
    console.log("Banco conectado!")
}).catch((err)=>{
    console.log(err)
})


//Access Route
app.get("/", (req, res)=>{
    res.send("ola")
})

app.post("/set-message", (req,res)=>{
    let {name, email, cellphone, message } = req.body  
    const newMessage = new Message({
    name:name,
    email:email,
    cellphone:cellphone,
    message:message
    })
    newMessage.save((err, message)=>{
        if(err) console.log(err)
        console.log(message)
    })  

})

app.get("/news",(req, res)=>{
    const newsPesquisa = "programming"
    const news = `https://newsapi.org/v2/everything?q=${newsPesquisa}&apiKey=fdbb0b23c7fe482b9a98a00908ab4f98`

    axios.get(news)
        .then((response)=>{
            res.send(JSON. stringify(response.data))
            console.log("api-acessada")
        })
        .catch((err)=>{
            console.log(err)
        })
})

app.listen(PORT, ()=>{
    console.log("Funcionando na porta: " + PORT)
})