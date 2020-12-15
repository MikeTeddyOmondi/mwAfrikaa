const express = require('express');
const router = express.Router();
const Article = require('../models/article')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// app.get('/', async (req, res) => {
//     const articles = await Article.find().sort({ createdAt: 'desc' })
//     res.render('articles/index', { articles: articles })
// })

// Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('dashboard', {
      user: req.user,
      articles: articles 
    })
  }
);



module.exports = router;
