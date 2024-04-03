function validateBody(body) {
  if (!body || !body.todo || !body.todo.author || !body.todo.content) {
    throw new Error("Malformed object is provided");
  }
}

module.exports = {
  validateBody,
};
