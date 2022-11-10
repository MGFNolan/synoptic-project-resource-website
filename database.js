const { Pool, Client } = require("pg");
const client = new Pool({
  user: "matthewnolan",
  host: "localhost",
  password: "postgres",
  database: "resources",
  port: 5432,
});

//function for adding/creating source to database
const addSrcDb = (sourceName, url, rating, tags, description) => {
  const text =
    "INSERT INTO resources(source_name, url, rating, tags, description) VALUES($1, $2, $3, $4, $5) RETURNING *";
  const values = [sourceName, url, rating, tags, description];

  client
    .query(text, values)
    .then((res) => {
      console.log(res.rows[0]);
    })
    .catch((e) => console.error(e.stack));
};

//addSrcDb()

//function for deleting source to database
const delSrcDb = (id) => {
  client.connect();
  const text = "DELETE FROM resources WHERE id = $1";
  const values = [id];

  client
    .query(text, values)
    .then((res) => {
      console.log("Successfully deleted");
    })
    .catch((e) => console.error(e.stack))
    .then(() => client.end());
};

//delSrcDb()

//function for reading sources from database
const readSrcDb = async () => {
  const text = "SELECT * FROM resources";

  const databaseResult = await client.query(text);
  return databaseResult.rows;
};

//function for updating sources in the database
const upSrcDb = (id, sourceName, url, rating, tags, description) => {
  client.connect();
  const text =
    "UPDATE resources SET source_name = $1, url = $2, rating = $3, tags = $4, description = $5 WHERE id = 5";
  const values = [sourceName, url, rating, tags, description];

  client
    .query(text, values)
    .then((res) => {
      console.log(res.rows);
    })
    .catch((e) => console.error(e.stack))
    .then(() => client.end());
};

//upSrcDb()

module.exports = { addSrcDb, delSrcDb, readSrcDb, upSrcDb };
