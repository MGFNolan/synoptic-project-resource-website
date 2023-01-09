const { Pool, Client } = require("pg");
const client = new Pool({
  user: "matthewnolan",
  host: "localhost",
  password: "postgres",
  database: "resources",
  port: 5432,
});

//function for adding/creating source to database
const addSrcDb = async (sourceName, url, rating, description) => {
  const text =
    "INSERT INTO resources(source_name, url, rating, description) VALUES($1, $2, $3, $4) RETURNING *";
  const values = [sourceName, url, rating, description];
  await client.query(text, values);
};

const addTagDb = async (tags) => {
  const text = "INSERT INTO tags(tag_name) VALUES($1) RETURNING *";
  const values = [tags];
  await client.query(text, values);
};

//function for deleting source to database
const delSrcDb = async (id) => {
  const text = "DELETE FROM resources WHERE id = $1";
  const values = [id];

  await client.query(text, values);
};

//function for reading sources from database
const readSrcDb = async () => {
  const text = "SELECT * FROM resources";
  const databaseResult = await client.query(text);

  return databaseResult.rows;
};

//function for updating sources in the database
const upSrcDb = async (id, sourceName, url, rating, tags, description) => {
  const text =
    "UPDATE resources SET source_name = $1, url = $2, rating = $3, tags = $4, description = $5 WHERE id = $6";
  const values = [sourceName, url, rating, tags, description, id];

  await client.query(text, values);
};

//upSrcDb()

module.exports = { addSrcDb, delSrcDb, readSrcDb, upSrcDb, addTagDb };
