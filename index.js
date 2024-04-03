const express = require("express");
const db = require("./db");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/todo", (req, res) => {
  const response = db.query(`SELECT * FROM todos`, []);
  res.send(response);
});

app.post("/api/todo", (req, res) => {
  const todo = req.body.todo;
  db.run(`INSERT INTO TODOS(todo,author) values(? , ?)`, [
    todo.content,
    todo.author,
  ]);
  res.status(201);
  res.send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
