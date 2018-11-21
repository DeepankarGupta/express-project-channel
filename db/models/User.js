const sequelize = require('sequelize')
const DT = sequelize.DataTypes

module.exports = {
    user : {
        username: {
            type: DT.STRING(50),
            allowNull: false,
            unique: true
          },
          email: {
            type: DT.STRING(50),
            allowNull: false,
            unique: true
          },
          bio: {
            type: DT.STRING(100)
          },
          password: {
            type: DT.STRING(50),
            allowNull: false
          }
    },
    getProfileResponse: function() {
      return {
        username:this.username,
        bio:this.bio
      }
    },
    getRegistrationResponse: function() {
      return {
        email: this.email,
        username: this.username,
        bio: this.bio
      }
    }
}