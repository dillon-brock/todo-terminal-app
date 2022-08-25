require("dotenv").config();
const cookie = require("cookie");
const fetch = require("cross-fetch");

async function signUpUser(firstName, lastName, email, password) {
  const res = await fetch(`${process.env.API_URL}/api/v1/users`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firstName, lastName, email, password }),
    credentials: "include",
  });
  const cookieInfo = cookie.parse(res.headers.raw()["set-cookie"][0]);
  const user = await res.json();
  return [cookieInfo, user];
}

async function signInUser(email, password) {
  const res = await fetch(`${process.env.API_URL}/api/v1/users/sessions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const cookieInfo = cookie.parse(res.headers.raw()["set-cookie"][0]);
  const user = await res.json();
  return [cookieInfo, user];
}

async function signOutUser() {
  const res = await fetch(`${process.env.API_URL}/api/v1/users`, {
    method: "DELETE",
    credentials: "include",
  });
}

module.exports = { signUpUser, signInUser, signOutUser };
