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
  setTags(tags, srcId);
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
const readSrcDb = async (tags) => {
  if (tags) {
    tagsArr = tags.split(" ");
    const set = new Set(tagsArr);
    tagsArr = Array.from(set);

    values = [tagsArr];
    //console.log(values);

    let text = `SELECT resources.*, STRING_AGG(tags.tag_name, ' ') AS tags FROM resources
  LEFT JOIN tags_resources ON resource_id = resources.id
  LEFT JOIN tags ON tags.tag_id = tags_resources.tag_id
  WHERE resources.id IN (
    SELECT resources.id FROM resources
    LEFT JOIN tags_resources ON resource_id = resources.id
    LEFT JOIN tags ON tags.tag_id = tags_resources.tag_id
    WHERE tags.tag_name = ANY ($1)
    GROUP BY 1
  )
  GROUP BY 1;`;
    const databaseResult = await client.query(text, values);

    //console.log(databaseResult);
    return databaseResult.rows;
  } else {
    let text = `SELECT resources.*, STRING_AGG(tags.tag_name, ' ') AS tags FROM resources
  LEFT JOIN tags_resources ON resource_id = resources.id
  LEFT JOIN tags ON tags.tag_id = tags_resources.tag_id
  GROUP BY 1`;
    const databaseResult = await client.query(text);

    //console.log(databaseResult);
    return databaseResult.rows;
  }
};

//function for updating sources in the database
const upSrcDb = async (id, sourceName, url, rating, tags, description) => {
  let text =
    "UPDATE resources SET source_name = $1, url = $2, rating = $3, description = $4 WHERE id = $5 RETURNING *";
  let values = [sourceName, url, rating, description, id];
  result = await client.query(text, values);

  text = "DELETE FROM tags_resources WHERE resource_id = $1";
  values = [id];
  await client.query(text, values);

  const srcId = result.rows[0].id;
  setTags(tags, srcId);
};

//upSrcDb()

async function setTags(tags, srcId) {
  tagsArr = tags.split(" ");
  const set = new Set(tagsArr);
  tagsArr = Array.from(set);
  console.log(tagsArr);

  tagsArr.forEach(async (tag) => {
    let values = [tag];
    let text = "SELECT * FROM tags WHERE tag_name = $1";
    let result = await client.query(text, values);
    let tagId;

    if (result.rows.length == 0) {
      text = `INSERT INTO tags(tag_name) VALUES($1) RETURNING *`;
      result = await client.query(text, values);
      console.log(result);
      tagId = result.rows[0].tag_id;
    } else {
      tagId = result.rows[0].tag_id;
    }

    text =
      "INSERT INTO tags_resources(resource_id, tag_id) VALUES($1, $2) RETURNING *";
    values = [srcId, tagId];
    await client.query(text, values);
  });
}

module.exports = {
  addSrcDb,
  delSrcDb,
  readSrcDb,
  upSrcDb,
};
