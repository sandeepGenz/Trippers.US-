const express = require('express');
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

const port =process.env.PORT || 3000; 

const routes = require('./api/routes'); 
routes(app); 
app.listen(port,function(){ console.log('Server started on port: ' + port); });