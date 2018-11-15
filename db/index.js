const Sequelize = require('sequelize')
const { user } = require('./models/User')

const db = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'channel',
    username: 'root',
    password: 'root',
})

const User = db.define('user', user)

User.prototype.getUsername = function() {
    console.log(this.username);
}

module.exports = {
    db,
    User
}