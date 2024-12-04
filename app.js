var express = require('express');
const cors = require('cors');
var app = express();
var cookieParser = require('cookie-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(async(req, res, next) => {
  console.log("\n===middleware===");
  try {
    if (!req.cookies.tId) {
      console.log("Null");
      console.log("===NEXT===");
    }
    else {
      console.log(`已有購物車編號: ${req.cookies.tId}`);
      console.log("===NEXT===");
    }
    next();
  } 
  catch (error) {
    console.error(`中介軟體處理請求時出錯: ${error.message}`);
    next(error);
  }
});

var setCookie = require('./routes/SetCookie');
var cart = require('./routes/funcCart');
var menu = require('./routes/funcMenu');
var good = require('./routes/funcGood');
app.use('/setCookie', setCookie);
app.use('/cart', cart);
app.use('/menu', menu);
app.use('/good', good);


// env or 3001 as port
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("Server run on port:" + port);
});