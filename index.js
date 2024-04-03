const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const todos = []

app.get('/api/todo', (req, res) => {
  res.send(todos)
})

app.post('/api/todo', (req, res) => {
  const todo = req.body.todo
  todos.push(todo)
  res.status(201)
  res.send()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})