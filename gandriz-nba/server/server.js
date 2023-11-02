require('dotenv').config()
const express = require('express')
const app = express()

const dbClient = require('./config/db.conf')


// test connection to db
app.get('/test', async (req, res) => {
    await dbClient.connect(err => {
    })
    const result = await dbClient.query('SELECT NOW()')
    await dbClient.end()
    res.send(result.rows[0])
})













app.listen(process.env.SERVER_PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT || 3000}`)
});