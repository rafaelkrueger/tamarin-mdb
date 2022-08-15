const express = require("express")
const axios = require("axios")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
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

//options

app.get("/", (req, res)=>{
    res.send("ola")
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