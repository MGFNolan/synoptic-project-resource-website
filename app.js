const express = require('express');
const app = express();
//const { readFileSync } = require('fs');
const bodyParser = require("body-parser");
var cors = require('cors');
//const { readSrcDb } = require('./database');
const port = 3000;

//const homePage = readFileSync('./index.html')

// app.get('/', (req, res) => {
//   const url = req.url

//   if (url === 'http://localhost:3000/') {
//     res.writeHead(200, { 'content-type': 'text/html' })
//     readFileSync.write(homePage)
//     res.end()
//   }
//   res.send('Hello World!')
// })

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/cat', (req, res) => {
  const url = req.url

  //if (url === 'http://localhost:3000/cat') {
    res.writeHead(200, { 'content-type': 'text/html' })
    res.end()
  //}
  res.send('Hello World!')
})

app.post('/item', (req, res) => {
  //res.writeHead(200, { 'content-type': 'text/json' })
  console.log(req.body)
  res.send(req.body)
  res.end()
})

app.get('/list', (req, res) => {
  res.send({"item":{"source":"fCC"}})
})

