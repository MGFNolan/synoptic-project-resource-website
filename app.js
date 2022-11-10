const express = require("express");
const app = express();
//const { readFileSync } = require('fs');
const bodyParser = require("body-parser");
var cors = require("cors");
const { addSrcDb } = require("./database");
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// app.post("/item", (req, res) => {
//   //res.writeHead(200, { 'content-type': 'text/json' })
//   addSrcDb("one", "two", "three", "four", "five");
//   console.log(req);
//   res.send(req.body);
//   res.end();
// });

app.get("/list", (req, res) => {
  res.send({
    sources: [
      {
        sourcename: "freeCodeCamp",
        url: "https://www.youtube.com/watch?v=qw--VYLpxG4&t=11100s",
        rating: 5,
        tags: ["this", "tag", "here"],
        description: "fantastic. Yes. Great",
      },
      {
        sourcename: "the bomb dot com",
        url: "https://www.thebombdotcom.com",
        rating: 5,
        tags: ["the", "bomb", "dotcom"],
        description: "this is great. The bomb-dot-com",
      },
    ],
  });
});
