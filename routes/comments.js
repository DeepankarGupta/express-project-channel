const { Router } = require('express')
const { User, Article, Comment } = require('../db/index')
const jwt = require('jsonwebtoken');

const route = Router()

let authorization = async function (req, res, next) {
    if (req.headers && req.headers.authorization) {
        let token = req.headers.authorization
        try {
            let decoded = await jwt.verify(token, 'qwerty');
            req.userId = decoded.id
            next()
        } catch (err) {
            console.log("here");
            res.status(400).json(err)
        }
    } else {
        res.status(400).json({ error: "authorization failed!"})
    }

}

//get comments for a particular article
route.get('/:slug/comments', async (req, res) => {
    try {
        let article = await Article.findOne({
            where: {
                slug: req.params.slug
            }
        })
        let comments = await Comment.findAll({
            where: {
                articleId: article.id
            },
            include: [User]
        })
        res.status(200).json({
            comments: comments.map((comment) => {
                return comment.getCommentResponse()
            })
        })
    } catch (e) {
        res.status(400).json(e)
    }
})

//add a comment to an article
route.post('/:slug/comments', authorization, async (req, res) => {
    try {
        console.log(req.params.slug);
        let article = await Article.findOne({
            where: {
                slug: req.params.slug
            }
        })
        let newComment = await Comment.create({
            body: req.body.comment.body,
            articleId: article.id,
            userId: req.userId
        })
        let comment = await Comment.findByPk(newComment.id, {
            include: [User]
        })
        res.status(200).json({
            comment: comment.getCommentResponse()
        })
    } catch (e) {
        console.log(e);
        res.status(400).json(e)
    }
})

//delete a particular comment
route.delete('/:slug/comments/:commentId', authorization, async (req, res) => {
    try {
        let comment = await Comment.findOne({
            where: {
                id: req.params.commentId
            },
            include: [User]
        })
        if(comment.user.id !== req.userId) {
            res.status(400).json({
                error: "authorization failed!"
            })
        }
        await comment.destroy()
        res.status(200).send()
    } catch (e) {
        res.status(400).json(e)
    }
})

module.exports = route