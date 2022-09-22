require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bycrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

// config JSON
app.use(express.json())


//models
const User = require('./models/User')
const { is } = require('express/lib/request')

app.get('/', (_request, response) => {
response.status(200).json({msg: "Acesso a Api"})
})


//register user
app.post('/auth/register', async(request, response) => {
    const {name, email, password, confirmpassword} = request.body
    //validação
    if(!name) {
        return response.status(422).json({msg: "Nome é obrigatorio!"})
    }
    if(!email) {
        return response.status(422).json({msg: "E-mail é obrigatorio!"})
    }
    if(!password) {
        return response.status(422).json({msg: "Senha é obrigatorio!"})
    }
    
    if(password !== confirmpassword) {
        return response.status(422).json({msg: " As senhas não conferem! "})
    }
    
  //checando usuario
  const userExists = await User.findOne({email: email})
  if(userExists) {
    return response.status(422).json({msg: "Utilize outro email"})
  }

  //crete password
  const salt = await bycrypt.genSalt(12)
  const passwordHash = await bycrypt.hash(password, salt)

  //create user
  const user = new User({
    name, email, password: passwordHash
  })

  try {
     await user.save()
     response.status(201).json({msg: "Usuario criado com sucesso"})
  } catch(error) {
    console.log(error)
     response.status(500).json({msg: "aconteceu erro no servidor"}) // fins didácticos
  }

})
//login user
app.post('/auth/login', async (request,response) => {
    const {email, password} = request.body

    //validações
    if(!email) {
        return response.status(422).json({msg: "E-mail é obrigatorio!"})
    }
    if(!password) {
        return response.status(422).json({msg: "Senha é obrigatorio!"})
    }

    //chegando se existe
    const user = await User.findOne({email: email})
    if(!user) {
      return response.status(422).json({msg: "Usuário não encontrado!"})
    }

    //conferir senha
    const checkPassword = await bycrypt.compare(password, user.password)
    if(!checkPassword) {
        return response.status(422).json({msg: "Senha inválida!"})
    }

    try {
        const secret = process.env.secret
        const token = jwt.sign({
            id: user._id
            },
            secret,
        )

        response.status(200).json({msg: "Autenticação realizada com sucesso", token})
    } catch (error) {
        console.log(error)
        response.status(500).json({msg: "aconteceu erro no servidor"}) 
    }

})


const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.qqskcdq.mongodb.net/?retryWrites=true&w=majority`).then(() => {
    app.listen(3000)
    console.log("conectou com banco!")
}).catch((err) => console.log(err))

