const express = require('express'),
  bodyParser = require('body-parser'),
  request = require('request'),
  cors = require('cors'),
  app = express(),
  PORT = 8000,
  gitHubAuth = 'https://github.com/login/oauth/access_token';

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.end();
});

app.post('/access_token', (req, res) => {
  request.post({
    url: gitHubAuth,
    formData: req.body,
    json: true
  }, function (err, r, data) {
      res.json(err || data);
  });
});

app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));