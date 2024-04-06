<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import axios from "axios";

const todos = reactive([]);
const selectedId = ref("");
const content = ref("");
const author = ref("");
const API_URL = "/api/todo";

onMounted(fetchAll);

watch(selectedId, (todoId) => {
  const selectedTodo = todos.filter((todo) => todo.id == todoId)[0];
  [author.value, content.value] = [selectedTodo.author, selectedTodo.todo];
});

async function fetchAll() {
  await axios
    .get(API_URL)
    .then((response) => {
      for (const element of response.data) {
        todos.push(element);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function todoAlreadyExists() {
  for (var  i = 0;  i < todos.length; i++) {
    if (todos[i].author == author.value && todos[i].todo == content.value) {
      return true;
    }
  }
}

async function create() {
  if (hasValidInput()) {
    if (!todoAlreadyExists()) {
      await axios.post(API_URL, {
        todo: { author: author.value, content: content.value },
      });
      await fetchAll();
      content.value = author.value = "";
    }
  }
}

function update() {
  if (hasValidInput() && selectedId.value) {
    const i = todos.indexOf(selectedId.value);
    todos[i] = selectedId.value = `${author.value}: ${content.value}`;
  }
}

function del() {
  if (selectedId.value) {
    const i = todos.indexOf(selectedId.value);
    todos.splice(i, 1);
    selectedId.value = content.value = author.value = "";
  }
}

function hasValidInput() {
  return content.value.trim() && author.value.trim();
}
</script>

<template>
  <select size="30" v-model="selectedId">
    <option v-for="todo in todos" :key="todo" :value="todo.id">
      {{ todo.author }}: {{ todo.todo }}
    </option>
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
