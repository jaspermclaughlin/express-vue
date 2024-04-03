const express = require("express");
const db = require("./db");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//GET ALL
app.get("/api/todo", (req, res) => {
  const response = db.query(`SELECT * FROM todos`, []);
  res.send(response);
});

//GET ONE
app.get("/api/todo/:idParam", (req, res) => {
  const response = db.query(`SELECT * FROM todos where id=?`, [
    req.params.idParam,
  ]);
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

app.delete("/api/todo/:idParam", (req, res) => {
  db.run("DELETE FROM TODOS where id=?", [req.params.idParam]);
  res.status(200);
  res.send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
