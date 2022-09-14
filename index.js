const express = require("express")
const axios = require("axios")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const conn = require("./connection")
const Message = require("./models/message")
const User = require("./models/Usuario")
const cloudinary = require("cloudinary").v2
const PORT = process.env.PORT || 8080

//Database Connection
conn()

cloudinary.config({ 
    cloud_name: 'tamarin-tech', 
    api_key: '739453756319644', 
    api_secret: 'vitA4c7VnVj9_5RctBDuRUhocpI' 
  });


//Middlewares
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*")
    app.use(cors())
    next()
})


//Access Route

app.post("/set-produto", async (req,res)=>{
    const {empresa,product,description,category, value, image} = req.body 
    const result = await cloudinary.uploader.upload(image,{
        folder:"samples"
    })
    User.updateOne(
        {_id:empresa},
        {$addToSet: { produto:{
            "product":product,
            "description":description, 
            "category":category, 
            "value":value,
            "image":result.secure_url
            
        }}}
        ).catch((err)=>{
        console.log(err)
        res.send(req.file)
    })
})


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
    let ProdutoArray = []
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
    produto:ProdutoArray,
    pedidos:PedidosArray,
    orcamento:OrcamentoArray,
    message:MessageArray
    })
    newUser.save((err, message)=>{
        if(err) console.log(err)
        console.log(message)
    })  
})


app.get("/all", (req, res)=>{
    User.find().then((response)=>{
        res.send(response)
    })
    .catch((err)=>{
        console.log(err)
    })
})

app.post("/delete-user", (req,res)=>{
    const {id} = req.body
    User.deleteOne({_id:id}).then((response)=>{
        res.send(response)
        console.log(response)
    }).catch((err)=>{
        console.log(err)
    })
})


app.post("/get-user", async (req, res)=>{
    let {email, password} = req.body  

    User.find({email:email}).then((response)=>{
        res.send(response)
        console.log(response)
    }).catch((err)=>{
        console.log(err)
    })

})

app.get("/empresa/:id", async (req, res)=>{

    const id = req.params.id
    User.findOne({_id:req.params.id}).then((response)=>{
        res.send(response)
    }).catch((err)=>{
        console.log(err)
    })

})

app.post("/set-categoria", (req,res)=>{
    const {empresa, category} = req.body
    User.updateOne(
        {_id:empresa},
        {$addToSet: { categorias:category } }
        ).then((response)=>{
        res.send(response)
    }).catch((err)=>{
        console.log(err)
    })

})



app.post("/delete-categoria", (req,res)=>{
    const {empresa, category} = req.body
    User.updateOne(
        {_id:empresa},
        {$pull: { categorias:category } }
        ).then((response)=>{
        res.send(response)
    }).catch((err)=>{
        console.log(err)
    })
})

app.post("/delete-produto", (req, res)=>{
    const {empresa, nomeProduto} = req.body
    User.updateOne(
        {_id:empresa},
        {$pull: { cardapio:{"product":nomeProduto} } }
        ).then((response)=>{
        res.send(response)
    }).catch((err)=>{
        console.log(err)
    })
})


app.post("/delete-pedido", async (req, res)=>{

    const {empresa, id} = req.body
    User.updateOne({_id:empresa}, {$pull:{pedidos:{id:id}}}).then((response)=>{
        res.send(response)
    }).catch((err)=>{
        console.log(err)
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