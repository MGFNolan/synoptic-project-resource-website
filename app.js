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

app.post("/item", (req, res) => {
  console.log(req.body)

  source = req.body.source
  url = req.body.url
  rating = req.body.rating
  tag = [req.body.tag]
  description = req.body.description

  addSrcDb(source, url, rating, tag, description)
  res.send({"response": "Successful"})

});

app.get("/list", async (req, res) => {
  databaseContents = await readSrcDb()
  console.log(databaseContents)
  res.send(databaseContents)
});
