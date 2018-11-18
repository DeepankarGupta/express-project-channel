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
    },
    getArticleResponse: function () {
        return {
            slug: this.slug,
            title: this.title,
            description: this.description,
            body: this.body,
            favoritesCount: this.favoritesCount,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            author: this.user.getProfileResponse()
        }
    }
}