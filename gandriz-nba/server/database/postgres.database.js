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
  const result = await client.query(text, values);
  return result.rows;
};

module.exports = { query, openConnection };
