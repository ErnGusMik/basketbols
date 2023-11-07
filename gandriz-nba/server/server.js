require('dotenv').config()
const express = require('express')
const app = express()

const dbClient = require('./database/postgres.database')

express.json()
app.use(express.urlencoded({ extended: true }))


// test connection to db
app.get('/test', async (req, res) => {
    await dbClient.connect(err => {
        console.log(err)
        res.send(err)
    })
    const result = await dbClient.query('SELECT NOW()')
    await dbClient.end()
    res.send(result.rows[0])
})


const apiRouter = require('./controllers/app.controllers')
app.use('/api', apiRouter)












app.listen(process.env.SERVER_PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT || 3000}`)
    dbClient.openConnection()
});