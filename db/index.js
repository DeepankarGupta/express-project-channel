const Sequelize = require('sequelize')
const { user, getProfileResponse } = require('./models/User')
const { article, getArticleResponse } = require('./models/Article')
const db = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'channel',
    username: 'root',
    password: 'root',
})

const User = db.define('user', user)
User.prototype.getProfileResponse = getProfileResponse
const Article = db.define('article', article)
Article.prototype.getArticleResponse = getArticleResponse

Article.belongsTo(User)

User.prototype.getUsername = function() {
    console.log(this.username);
}

module.exports = {
    db,
    User,
    Article
}