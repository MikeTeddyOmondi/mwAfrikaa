const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')

const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true, useCreateIndex: true}
  )
  .then(() =>   console.log('_________________________________________'),
                console.log('_________________________________________'),
                console.log('Database server connection initiated...'),
                console.log('Database server connection success...'),
                console.log('_________________________________________'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Other middleware
app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/articles', articleRouter)

// app.get('/', async (req, res) => {
//     const articles = await Article.find().sort({ createdAt: 'desc' })
//     res.render('articles/index', { articles: articles })
// })

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
    if(!err){
        console.log(`_________________________________________`)
        console.log(`Application server started at port: ${PORT}`)
    } else{
        console.log(`___________________________________________________________`)
        console.log(`Error occured while starting the application server: ${err}`)
        console.log(`___________________________________________________________`)
    }
})










// code from blog

// mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
//     if(!err){
//         console.log('_________________________________________')
//         console.log('Database server connection initiated...')
//         console.log('Database server connection success...')
//         console.log('_________________________________________')
//     } else{
//         console.log(`__________________________________________`)
//         console.log(`Error : ${err}`)
//         console.log(`__________________________________________`)
//     }
// })


