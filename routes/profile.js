const { Router } = require('express')
const { User } = require('../db/index')
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

route.post('/:username/follow', authorization, async (req,res) => {
    try {
        let username = await req.params.username
        let user = await User.findByPk(req.userId)
        let folowee = await User.findOne({ where: { username: username } })
        user.addFollowees(folowee)
        res.status(200).json({msg: "Success"})
    } catch (e) {
        res.status(400).json(e)
    }
    
})

module.exports = route