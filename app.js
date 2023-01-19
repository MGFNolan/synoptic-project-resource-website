const express = require("express");
const app = express();
//const { readFileSync } = require('fs');
const bodyParser = require("body-parser");
var cors = require("cors");
const { addSrcDb, delSrcDb, readSrcDb, upSrcDb } = require("./database");
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.put("/item/:id", (req, res) => {
  source = req.body.source;
  url = req.body.url;
  rating = req.body.rating;
  tag = [req.body.tag];
  description = req.body.description;
  id = req.body.id;
  console.log(req.body);
  upSrcDb(id, source, url, rating, tag, description);
  res.send({ response: "Update successful" });
});

app.post("/item", (req, res) => {
  source = req.body.source;
  url = req.body.url;
  rating = req.body.rating;
  tag = req.body.tag;
  description = req.body.description;

  tag = tag.split(" ");

  addSrcDb(source, url, rating, description, tag);
  res.send({ response: "Successful" });
});

app.delete("/item/:id", (req, res) => {
  const id = req.params.id;

  delSrcDb(id);
  res.send({ response: `Item with ID ${id} has been deleted. Forever.` });
});

app.get("/list", async (req, res) => {
  databaseContents = await readSrcDb();
  console.log(databaseContents);
  res.send(databaseContents);
});
