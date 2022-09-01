const express = require('express');
const app = express();
const { readFileSync } = require('fs');
const port = 3000;

const homePage = readFileSync('./index.html')

app.get('/', (req, res) => {
  const url = req.url

  if (url === 'http://localhost:3000/') {
    res.writeHead(200, { 'content-type': 'text/html' })
    readFileSync.write(homePage)
    res.end()
  }
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// var myHeaders = new fetch.Headers();
// myHeaders.append("Content-Type", "application/json");

// var raw = JSON.stringify({
//   "item": "corn"
// });

// var requestOptions = {
//   method: 'GET',
//   headers: myHeaders,
//   body: raw,
//   redirect: 'follow'
// };

// fetch("http://localhost:3000", requestOptions)
//   .then(response => response.text())
//   .then(result => console.log(result))
//   .catch(error => console.log('error', error));