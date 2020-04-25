//Configuring different parts of the server
const path = require('path');
const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const app = express();
const cors = require("cors");
app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Setting up server
const port = 8000;
const server = app.listen(port, ()=>{console.log(`running on localhost:
  ${port}`)});

//Letting express know which directory to check
app.use(express.static('dist'));

//Sending the home page HTML to the server using a get method
app.get('/', function(req,res){
  res.sendFile(path.resolve('dist/index.html'))
});

//Set up APIs

//Set up POST Request

//Set up GET Request
app.get('/getGeoData', function(req, res){
  res.send('hello world');
})
