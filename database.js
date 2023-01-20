const { Pool, Client } = require("pg");
const client = new Pool({
  user: "matthewnolan",
  host: "localhost",
  password: "postgres",
  database: "resources",
  port: 5432,
});

//function for adding/creating source to database
const addSrcDb = async (sourceName, url, rating, description, tags) => {
  let text =
    "INSERT INTO resources(source_name, url, rating, description) VALUES($1, $2, $3, $4) RETURNING *";
  let values = [sourceName, url, rating, description];
  let result = await client.query(text, values);
  const srcId = result.rows[0].id;

  text = "INSERT INTO tags(tag_name) VALUES($1) RETURNING *";
  values = tags;
  result = await client.query(text, values);
  console.log(result);
  const tagId = result.rows[0].tag_id;

  text =
    "INSERT INTO tags_resources(resource_id, tag_id) VALUES($1, $2) RETURNING *";
  values = [srcId, tagId];
  await client.query(text, values);
};

//function for deleting source to database
const delSrcDb = async (id) => {
  let text = "DELETE FROM resources WHERE id = $1";
  let values = [id];
  await client.query(text, values);

  text = "DELETE FROM tags_resources WHERE resource_id = $1";
  await client.query(text, values);
};

//function for reading sources from database
const readSrcDb = async () => {
  let text = `SELECT resources.*, STRING_AGG(tags.tag_name, ',') AS tags FROM resources
  LEFT JOIN tags_resources ON resource_id = resources.id
  LEFT JOIN tags ON tags.tag_id = tags_resources.tag_id
  GROUP BY 1`;
  const databaseResult = await client.query(text);

  console.log(databaseResult);
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

module.exports = {
  addSrcDb,
  delSrcDb,
  readSrcDb,
  upSrcDb,
};
