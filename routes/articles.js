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
        var article = await Article.findById( newArticle.id, { include: [User] })
        await delete article.dataValues.userId
        await delete article.dataValues.user.dataValues.password
        res.status(201).json(article)
    } catch (err) {
        res.status(400).json({ error: "the article could not be added"})
    }
})

module.exports = route