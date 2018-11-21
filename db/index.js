const Sequelize = require('sequelize')
const { user, getProfileResponse, getRegistrationResponse } = require('./models/User')
const { article, getArticleResponse } = require('./models/Article')
const { comment, getCommentResponse } = require('./models/Comment')
const db = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'channel',
    username: 'root',
    password: 'root',
})

const User = db.define('user', user)
const Article = db.define('article', article)
const Comment = db.define('comment', comment)

User.prototype.getProfileResponse = getProfileResponse
User.prototype.getRegistrationResponse = getRegistrationResponse
Article.prototype.getArticleResponse = getArticleResponse
Comment.prototype.getCommentResponse = getCommentResponse

Article.belongsTo(User)
User.hasMany(Article)
User.belongsToMany(User, {as: 'followees', through:'follow'})
Comment.belongsTo(User)
Comment.belongsTo(Article)

module.exports = {
    db,
    User,
    Article,
    Comment
}