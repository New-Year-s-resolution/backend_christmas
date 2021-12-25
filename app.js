// express app 
const express = require("express")

const port = 3000
const bodyParser = require('body-parser')
const app = express()
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
require('dotenv').config()

// cors
const cors = require("cors")
app.use(cors())


// rss-parser
const Parser = require("rss-parser")
const parser = new Parser()

//mongodb schemas and connect
const mongoose = require("mongoose");
const connect = require("./schemas");
connect();


//router
const indexRouter = require("./router/index")
const userRouter = require("./router/users")
app.use('/', indexRouter)
app.use('/users', userRouter)

const todoRouter = require("./router/todo")
app.use('/todo', todoRouter)


app.listen(port, () => {
    console.log(`App is ready at http://localhost:${port}`)
})

