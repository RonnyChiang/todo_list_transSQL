// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')

// routes
router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  // check error
  const error = []
  if (!name || !email || !password || !confirmPassword) {
    error.push({ message: '所有欄位都是必須填寫的!' })
  }
  if (password !== confirmPassword) {
    error.push({ message: '密碼與確認密碼不符!' })
  }
  if (error.length) {
    return res.render('register', {
      error,
      name,
      email,
      password,
      confirmPassword
    })
  }
  // find existed email
  User.findOne({ email }).then(user => {
    if (user) {
      error.push({ message: '這個 Email 已經註冊過了!' })
      return res.render('register', {
        error,
        name,
        email,
        password,
        confirmPassword
      })
    } else {
      return User.create({
        name,
        email,
        password
      })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    }

  })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})
// 匯出路由模組
module.exports = router