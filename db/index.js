const Sequelize = require('sequelize')
const { user } = require('./models/User')
const { article } = require('./models/Article')
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

Article.belongsTo(User, {foreignKey: 'userId'})

User.prototype.getUsername = function() {
    console.log(this.username);
}

module.exports = {
    db,
    User,
    Article
}