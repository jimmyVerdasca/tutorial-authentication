require('dotenv/config');
const express = require('express');
const passport = require('passport');
const { port } = require('./config');
const api = require('./routes/api');
const auth = require('./routes/auth');
const cors = require('cors');
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb+srv://example:vLLv9md5L9spb80K@ga-demo-bcqlk.mongodb.net/movies-explorer?retryWrites=true";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("movies-explorer");
  dbo.createCollection("users")
  var query = { movies: "" };
  dbo.collection("users").find().toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use('/api', api);
app.use('/auth', auth);
app.use(cors());

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`Magic happens at http://localhost:${port}`);
});
