const express = require('express');
const app = express();

const db = require('./config/mongoose-connection');

const path = require("path");
const cookieParser = require('cookie-parser');

const usersRouter = require('./routes/userRouter');
const ownersRouter = require('./routes/ownerRouter');
const productsRouter = require('./routes/productRouter');
const indexRouter = require('./routes/indexRouter');

const multer = require('multer');

const expressSession = require('express-session');
const flash = require('connect-flash');

require("dotenv").config();

app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
})
);
app.use(flash())
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/hello' ,(req,res) =>{
    let success = req.flash('success');
    res.render('hello',{success});
})


app.use('/owners', ownersRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});