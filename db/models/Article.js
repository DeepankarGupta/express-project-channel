const sequelize = require('sequelize')
const DT = sequelize.DataTypes

module.exports = {
    article: {
        slug: {
            type: DT.STRING(50),
            allowNull: false,
            unique: true
        },
        title: {
            type: DT.STRING(50),
            allowNull: false
        },
        description: {
            type: DT.STRING(50),
            allowNull: false
        },
        body: {
            type: DT.STRING(50),
            allowNull: false
        },
        favoritesCount: {
            type: DT.BIGINT,
            defaultValue: 0
        }
    }
}