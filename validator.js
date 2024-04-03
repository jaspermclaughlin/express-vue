function validateBody(body) {
  if (!body || !body.todo || !body.todo.author || !body.todo.content) {
    throw new Error("Malformed object is provided");
  }
  if (
    typeof body.todo.author != "string" ||
    typeof body.todo.content != "string"
  ) {
    throw new Error("Input has to be string");
  }
}

module.exports = {
  validateBody,
};
