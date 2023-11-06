const client = require('./../config/db.conf')

const runQuery = async (text, values) => {
    await client.connect(err => {
        console.log(err)
        return err
    })
    const result = await client.query(text, values)
    await client.end()
    return result.rows
}

module.exports = runQuery