const express = require('express')
const { db } = require('./db/index.js')
const app = express()


app.use(express.json())
// app.use()

app.use('/user', require('./routes/users'))
app.use('/articles', require('./routes/articles'))
app.use('/profile', require('./routes/profile'))

db.sync(/* {force: true} */)
    .then(() => {
        app.listen(9999, () => {
            console.log('Server started http://localhost:9999')
        })
    })