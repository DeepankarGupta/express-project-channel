const sequelize = require('sequelize')
const DT = sequelize.DataTypes

module.exports = {
    comment : {
        body: {
            type: DT.STRING(50),
            allowNull: false
          }
    },
    getCommentResponse: function() {
      return {
        id:this.id,
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        author: this.user.getProfileResponse()
      }
    }
}