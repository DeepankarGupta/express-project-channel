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
        } catch (e) {
            res.status(400).json(e)
        }
    } else {
        res.status(400).json({
            error: "authorization failed!"
        })
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
    } catch (e) {
        console.log(e);
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
    } catch (e) {
        console.log(e)
        res.status(400).json(e)
    }
})

//get your feed
route.get('/feed', authorization, async (req, res) => {
    try {
        let user = await User.findByPk(req.userId)
        let folowees = await user.getFollowees()
        let foloweesId = []
        for (let i = 0; i < folowees.length; i++) {
            let id = folowees[i].id
            foloweesId.push(id)
        }
        let articles = await Article.findAll({
            where: {
                userId: foloweesId
            },
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
        console.log(e)
        res.status(400).json(e)
    }
})

//get a particular article
route.get('/:slug', async (req, res) => {
    try {
        let newArticle = await Article.findOne({
            where: {
                slug: req.params.slug
            },
            include: [User]
        })
        res.status(200).json({
            article: newArticle.getArticleResponse()
        })
    } catch (e) {
        res.status(400).json(e)
    }
})

//update a particular article
route.put('/:slug', authorization, async (req, res) => {
    try {
        let article = await Article.findOne({
            where: {
                slug: req.params.slug
            },
            include: [User]
        })
        if(article.user.id !== req.userId) {
            res.status(400).json({
                error: "authorization failed!"
            })
        }
        await article.update(req.body.article)
        res.status(200).json({
            article: article.getArticleResponse()
        })
    } catch (e) {
        res.status(400).json(e)
    }
})

//delete a particular article
route.delete('/:slug', authorization, async (req, res) => {
    try {
        let article = await Article.findOne({
            where: {
                slug: req.params.slug
            },
            include: [User]
        })
        if(article.user.id !== req.userId) {
            res.status(400).json({
                error: "authorization failed!"
            })
        }
        await article.destroy()
        res.status(200).send()
    } catch (e) {
        res.status(400).json(e)
    }
})

module.exports = route