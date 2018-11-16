const express = require('express')
const { db } = require('./db/index.js')
const app = express()


app.use(express.json())
// app.use()

app.use('/user', require('./routes/users'))
app.use('/articles', require('./routes/articles'))

db.sync()
    .then(() => {
        app.listen(9999, () => {
            console.log('Server started http://localhost:9999')
        })
    })