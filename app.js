require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bycrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

app.listen(3000)
