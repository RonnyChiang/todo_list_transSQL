// connect dbserver
const mongoose = require('mongoose')
const Todo = require('../todo')

mongoose.connect('mongodb://localhost/todo-list')

// connect db status  
const db = mongoose.connection
// error
db.on('error', () => {
  console.log('mongodb error!')
})
// succes
db.once('open', () => {
  console.log('mongodb connected!')
  for (let i = 0; i < 10; i++) {
    Todo.create({ name: 'name-' + i })
  }
  console.log('done')
})