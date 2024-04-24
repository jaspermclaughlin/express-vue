const express = require("express");
const db = require("./db");
const validator = require("./validator");
const app = express();
const port = 3000;
const authMiddleware = require("./auth-middleware");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(authMiddleware.basicAuth);

//GET ALL
app.get("/api/todo", (req, res) => {
  const response = db.query(`SELECT * FROM todos`, []);
  res.send(response);
});

//GET ONE
app.get("/api/todo/:idParam", (req, res) => {
  const response = db.query(`SELECT * FROM todos WHERE id=?`, [
    req.params.idParam,
  ]);
  if (response.length == 0) {
    res.status(404);
    res.send({
      message: "not found",
    });
  }
  res.send(response);
});

app.post("/api/todo", (req, res) => {
  const body = req.body;
  try {
    validator.validateBody(body);
  } catch (err) {
    console.log(err.message);
    res.status(400);
    res.send({
      message: err.message,
    });
  }
  db.run(`INSERT INTO todos(todo,author) VALUES(? , ?)`, [
    body.todo.content,
    body.todo.author,
  ]);
  res.status(201);
  res.send({
    message: "Todo created successfully!",
  });
});

app.delete("/api/todo/:idParam", (req, res) => {
  db.run("DELETE FROM todos WHERE id=?", [req.params.idParam]);
  res.status(200);
  res.send({
    message: "Todo deleted successfully!",
  });
});

app.put("/api/todo/:idParam", (req, res) => {
  const todo = req.body.todo;
  db.run("UPDATE todos SET todo = ?, author = ? WHERE id=?", [
    todo.content,
    todo.author,
    req.params.idParam,
  ]);
  res.status(201);
  res.send({
    message: "Todo updated successfully!",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
