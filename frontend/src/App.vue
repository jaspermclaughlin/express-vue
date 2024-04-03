<script setup>
import { ref, reactive, watch } from "vue";

const todos = reactive(["Jasper: Kochen", "Daniel: Backen", "Mariel: Wischen"]);
const selected = ref("");
const content = ref("");
const author = ref("");

watch(selected, (todo) => {
  [author.value, content.value] = todo.split(": ");
});

function create() {
  if (hasValidInput()) {
    const fullTodo = `${author.value}, ${content.value}`;
    if (!todos.includes(fullTodo)) {
      todos.push(fullTodo);
      content.value = author.value = "";
    }
  }
}

function update() {
  if (hasValidInput() && selected.value) {
    const i = todos.indexOf(selected.value);
    todos[i] = selected.value = `${author.value}: ${content.value}`;
  }
}

function del() {
  if (selected.value) {
    const i = todos.indexOf(selected.value);
    todos.splice(i, 1);
    selected.value = content.value = author.value = "";
  }
}

function hasValidInput() {
  return content.value.trim() && author.value.trim();
}
</script>

<template>
  <select size="5" v-model="selected">
    <option v-for="todo in todos" :key="todo">{{ todo }}</option>
  </select>

  <label>ToDo Content: <input v-model="content" /></label>
  <label>Author: <input v-model="author" /></label>

  <div class="buttons">
    <button @click="create">Create</button>
    <button @click="update">Update</button>
    <button @click="del">Delete</button>
  </div>
</template>

<style>
* {
  font-size: inherit;
}

input {
  display: block;
  margin-bottom: 10px;
}

select {
  float: left;
  margin: 0 1em 1em 0;
  width: 14em;
}

.buttons {
  clear: both;
}

button + button {
  margin-left: 5px;
}
</style>
