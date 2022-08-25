require("dotenv").config();
const fetch = require("cross-fetch");
const cookie = require("cookie");

async function listTodos(userCookie) {
  const res = await fetch(`${process.env.API_URL}/api/v1/todos`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Cookie: cookie.serialize("session", userCookie.session),
    },
    credentials: "include",
  });

  const todos = await res.json();
  return todos;
}

async function addTodo(userCookie, todo) {
  const res = await fetch(`${process.env.API_URL}/api/v1/todos`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Cookie: cookie.serialize("session", userCookie.session),
    },
    body: JSON.stringify({ task: todo }),
    credentials: "include",
  });

  const newTodo = await res.json();
  return newTodo;
}

async function completeTodo(userCookie, id) {
  const res = await fetch(`${process.env.API_URL}/api/v1/todos/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Cookie: cookie.serialize("session", userCookie.session),
    },
    credentials: "include",
    body: JSON.stringify({ completed: true }),
  });
}

async function deleteTodo(userCookie, id) {
  const res = await fetch(`${process.env.API_URL}/api/v1/todos/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Cookie: cookie.serialize("session", userCookie.session),
    },
    credentials: "include",
  });
}

module.exports = { listTodos, addTodo, deleteTodo, completeTodo };
