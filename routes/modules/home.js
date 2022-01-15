// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 引用 Todo model
const db = require('../../models')
const Todo = db.Todo
const User = db.User
// 定義首頁路由
// 設定首頁路由
router.get('/', (req, res) => {
  const userId = req.user.id
  Todo.findAll({
    where: { userId }, // 篩選條件
    raw: true, nest: true, // 轉換 plain object
    order: [["id", "ASC"]] // 排序
  })
    .then(todos => res.render('index', { todos })) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})
// 匯出路由模組
module.exports = router