require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bycrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

app.get('/', (request, response) => {
response.status(200).json({msg: "Acesso a Api"})
})

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS


mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.qqskcdq.mongodb.net/?retryWrites=true&w=majority`).then(() => {
    app.listen(3000)
    console.log("conectou com banco!")
}).catch((err) => console.log(err))

