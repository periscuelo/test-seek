const express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const consign = require('consign');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8082');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

consign()
  .include('utils')
  .then('routes')
  .then('models')
  .into(app);

app.routes.index.start(app);
app.routes.customers.start(app);
app.routes.products.start(app);

const port = 8080;
const sPort = 8081;
const time = new Date().toLocaleTimeString();
app.listen(port, () => {
  console.log(`App listening on port ${port} ${time}`);
});

https.createServer({
  key: fs.readFileSync('./ssl/localhost.key'),
  cert: fs.readFileSync('./ssl/localhost.crt'),
}, app).listen(sPort, () => {
  console.log(`App listening on secure port ${sPort} ${time}`);
});
