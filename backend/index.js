const express = require("express");
const db = require("./db");
const validator = require("./validator");
const app = express();
const port = 3000;
const crypto = require("crypto");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//From: https://stackoverflow.com/questions/23616371/basic-http-authentication-with-node-and-express-4/33905671#33905671
app.use((req, res, next) => {
  const auth = {
    login: "admin",
    hashedPassword:
      "b04047fbbd9dd9b4fd8ce3bed0a513a7e7de0de285aa57613dede051f8877edd",
  };

  const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
  const [login, password] = Buffer.from(b64auth, "base64")
    .toString()
    .split(":");
  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  if (
    login &&
    hashedPassword &&
    login === auth.login &&
    hashedPassword === auth.hashedPassword
  ) {
    return next();
  }

  res.set("WWW-Authenticate", 'Basic realm="401"');
  res.status(401).send("Authentication required.");
});

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
