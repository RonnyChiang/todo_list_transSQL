const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/user')

module.exports = app => {
  // init
  app.use(passport.initialize())
  app.use(passport.session())
  // set strategy

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
  }, (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, req.flash("loginError_msg", 'That email is not registered!'))
        }
        if (user.password !== password) {
          return done(null, false, req.flash("loginError_msg", 'Email or Password incorrect.'))
        }
        return done(null, user)
      })
      .catch(err => done(err, false))
  }))
  //serialize
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}