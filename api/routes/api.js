var MongoClient = require('mongodb').MongoClient;

const express = require('express');
const passport = require('passport');

const router = express.Router();
var url = "mongodb+srv://example:vLLv9md5L9spb80K@ga-demo-bcqlk.mongodb.net/movies-explorer?retryWrites=true";

/**
 * authenticationRequired is a middleware that use the jwt strategy to authenticate
 * the use. If authentication fails, passport will respond with a 401 Unauthorized status.
 * If authentication succeeds, the `req.user` property will be set to the authenticated user.
 */
const authenticationRequired = passport.authenticate('jwt', { session: false });

/**
 * authentication middleware overrides the default behavior of passport. The next handler is
 * always invoked. If authentication fails, the `req.user` property will be set to null.
 * If authentication succeeds, the `req.user` property will be set to the authenticated user.
 * see: http://www.passportjs.org/docs/authenticate/#custom-callback
 */
const authentication = (req, res, next) => {
  return passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) { next(err) }
    req.user = user || null;
    next();
  })(req, res, next);
}

// This endpoint is accessible by authenticated and anonymous users
router.get('/public', authentication, (req, res) => {
  const username = req.user ? req.user.username : 'anonymous';
  res.send({ message: `Hello ${username}, this message is public!` })
})

// This endpoint is protected and has access to the authenticated user.
router.get('/private', authenticationRequired, (req, res) => {
  res.send({ message: `Hello ${req.user.username}, only logged in users can see this message!` })
})

// This endpoint is protected and has access to the authenticated user.
router.get('/me', authenticationRequired, (req, res) => {
  res.send({ user: req.user });
})

router.get('/movies', authenticationRequired, (req, res) => {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("movies-explorer");
    dbo.collection("movies").find().toArray(function(err, result) {
      if (err) throw err;
      res.send(result);
      db.close();
    });
  });
})

module.exports = router;