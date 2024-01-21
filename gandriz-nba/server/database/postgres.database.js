const client = require("./../config/db.conf");

const openConnection = async () => {
  client.connect((err) => {
    if (err) {
      console.log(err);
      return err;
    }
  });
};

const query = async (text, values) => {
  try {
    const result = await client.query(text, values);
    return result.rows;
  } catch (err) {
    console.log(err);
    return await err;
  }
};

module.exports = { query, openConnection };
