const express = require("express")
const axios = require("axios")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const mongoose = require("mongoose");
const Message = require("./models/message")
const User = require("./models/Usuario")
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
mongoose.connect("mongodb+srv://rafaelkrueger:Vidanormal01@tamarin.3bbedo7.mongodb.net/?retryWrites=true&w=majority",
{useNewUrlParser: true, 
    useUnifiedTopology: true}).then(()=>{
    console.log("Banco conectado!")
}).catch((err)=>{
    console.log(err.message)
})


//Access Route
app.get("/", (req, res)=>{
    res.send("ola")
})

app.post("/set-message", (req,res)=>{
    let {name, email, number, message } = req.body  
    const newMessage = new Message({
    name:name,
    email:email,
    number:number,
    message:message
    })
    newMessage.save((err, message)=>{
        if(err) console.log(err)
        console.log(message)
    })  
})


app.post("/set-user", (req,res)=>{

    const {logo, name, email, password, numero, site, user} = req.body

    let UserArray = []
    let CardapioArray = []
    let PedidosArray = []
    let OrcamentoArray = []
    let MessageArray = []

    const newUser = new User({
    logo:logo,
    name:name,
    email:email,
    password:password,
    number:numero,
    site:site,
    users:user,
    cardapio:CardapioArray,
    pedidos:PedidosArray,
    orcamento:OrcamentoArray,
    message:MessageArray
    })
    newUser.save((err, message)=>{
        if(err) console.log(err)
        console.log(message)
    })  
})

app.post("/get-user", async (req, res)=>{
    let {email, password} = req.body  

    const main = async () =>{
        await sleep(15000)
        const FindUser = await User.findOne({email:email}).exec((err,user)=>{
            if(err)console.log(err)
            res.send(user)
        })
    }
    main();        

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