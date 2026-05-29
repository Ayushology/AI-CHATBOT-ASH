const express = require('express')

const app = express()

app.get('/',(req,resp)=>{
    resp.send("hello world!");
})
 module.exports = app