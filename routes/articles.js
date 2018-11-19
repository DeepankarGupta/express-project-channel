const {
    Router
} = require('express')
const {
    Article
} = require('../db/index')
const {
    User
} = require('../db/index')
const slugify = require('slugify')
const jwt = require('jsonwebtoken')

const route = Router()

let authorization = async function (req, res, next) {
    if (req.headers && req.headers.authorization) {
        let token = req.headers.authorization
        try {
            let decoded = await jwt.verify(token, 'qwerty');
            req.userId = decoded.id
            next()
        } catch (err) {
            res.status(400).json(err)
        }
    }

}

//post new article
route.post('/', authorization, async (req, res) => {
    try {
        const slug = slugify(req.body.article.title) + "-" + Date.now()
        let newArticle = await Article.create({
            slug: slug,
            title: req.body.article.title,
            description: req.body.article.description,
            body: req.body.article.body,
            userId: req.userId
        })
        var article = await Article.findById(newArticle.id, {
            include: [User]
        })
        res.status(201).json({
            article: article.getArticleResponse()
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            error: "the article could not be added"
        })
    }
})

//get global feed
route.get('/', async (req, res) => {
    try {
        let articles = await Article.findAll({
            include: [User],
            order: [
                ['createdAt', 'DESC']
            ]
        })
        res.status(200).json({
            articles: articles.map((article) => {
                return article.getArticleResponse()
            }),
            articlesCount: articles.length
        })
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
})

//get your feed
route.get('/feed', authorization ,async (req, res) => {
    try {
        let user = await User.findByPk(req.userId)
        let folowees = await user.getFollowees()
        let foloweesId = []
        for(let i=0; i<folowees.length; i++) {
            let id = folowees[i].id
            foloweesId.push(id)
        }
        let articles = await Article.findAll({ where: { 
            userId: foloweesId
        }})
        res.status(200).json(articles)
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
})

module.exports = route