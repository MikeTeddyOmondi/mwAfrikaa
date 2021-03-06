const express = require('express')
const Article = require('./../models/article')
const Trash = require('../models/Trash')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const router = express.Router()

router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('articles/new', { article: new Article() })
}) 

router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
}) 

router.get('/:slug', ensureAuthenticated, async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug})
    if (article == null) res.redirect('/')
    res.render('articles/show', { article: article })
})

router.post('/', ensureAuthenticated, async (req, res, next) => {
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))

router.put('/:id', ensureAuthenticated, async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))


router.delete('/:id', ensureAuthenticated, async (req, res, next) => {    
    let article = await Article.findById(req.params.id)
    try{
        let articleToTrash = new Trash({
            _id: article._id,
            createdAt: article.createdAt,
            title: article.title,
            description: article.description,
            markdown: article.markdown
        })
        await articleToTrash.save()
        await Article.findByIdAndDelete(article)
        res.redirect('/')
    } catch (e){
        console.log(`Error occured while deleting the article:${e}`)
    }
})

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        } catch (e){
            console.log(e) 
            res.render(`articles/${path}`, { article: article })
        }
    }
}

module.exports = router
