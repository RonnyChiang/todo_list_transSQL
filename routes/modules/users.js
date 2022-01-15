// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

const db = require('../../models')
const Todo = db.Todo
const User = db.User

const passport = require('passport')
const bcrypt = require('bcryptjs')

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
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必須填寫的!' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不符!' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  // find existed email
  User.findOne({ where: { email } }).then(user => {
    if (user) {
      errors.push({ message: '這個 Email 已經註冊過了!' })
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    } else {
      return bcrypt
        .genSalt(10) // 產生「鹽」，並設定複雜度係數為 10
        .then(salt => bcrypt.hash(password, salt)) // 為使用者密碼「加鹽」，產生雜湊值
        .then(hash => User.create({
          name,
          email,
          password: hash // 用雜湊值取代原本的使用者密碼
        }))
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