// 載入 express 並建構應用程式伺服器
const express = require('express')
const exphbs = require('express-handlebars');
// 載入 method-override
const methodOverride = require('method-override')
// 載入session
const session = require('express-session')
// 載入flash
const flash = require('connect-flash')

require('dotenv').config()

// 引用路由器
const routes = require('./routes')

const usePassport = require('./config/passport')

// MySQL
const db = require('./models')
const Todo = db.Todo
const User = db.User

const app = express()
const PORT = process.env.PORT

app.use(express.urlencoded({ extended: true }))
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))

// set session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

// passport
usePassport(app)

//flash
app.use(flash())  // 掛載套件
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')  // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg')  // 設定 warning_msg 訊息
  res.locals.loginError_msg = req.flash('loginError_msg')
  next()
})

//auth
app.use((req, res, next) => {
  console.log(req.user)
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})
// 將 request 導入路由器
app.use(routes)


// 設定 port 3000
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})