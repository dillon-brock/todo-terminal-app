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

module.exports = { listTodos };
