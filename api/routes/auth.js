
var MongoClient = require('mongodb').MongoClient;

const express = require('express');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const { jwtOptions } = require('../config');
var url = "mongodb+srv://example:vLLv9md5L9spb80K@ga-demo-bcqlk.mongodb.net/movies-explorer?retryWrites=true";

const router = express.Router();
const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  (username, password, done) => {
    // here you should make a database call
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("movies-explorer");
      dbo.collection("users").find({username: username, password: password}).toArray(function(err, USER) {
        if (err) return done(null, false);
        if (username === USER[0].username && password === USER[0].password) {
          console.log("plop");
          return done(null, USER);
        }
        db.close();
      });
    });
    
    return done(null, false);
  },
));

passport.use(new JWTStrategy(
  {
    secretOrKey: jwtOptions.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  (jwtPayload, done) => {
    const { userId } = jwtPayload;
    if (userId !== USER.id) {
      return done(null, false);
    }
    return done(null, USER[0]);
  },
));

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const { password, ...user } = req.user[0];
  console.log(user._id)
  const token = jwt.sign({ userId: user._id }, jwtOptions.secret);
  res.end({ user, token });
});

router.post('/register', (req, res) => {
  const username = req.query.username;
  const password = req.query.password;
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE,GET,PATCH,POST,PUT,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Content-Type': 'text/plain;charset=utf-8'
  });

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("movies-explorer");
    dbo.collection("users").insertOne({username: username, password: password, watchList: []})
  
    res.status(201).send("user Created");
  });
});

module.exports = router;