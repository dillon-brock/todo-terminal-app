#!/usr/bin/env node
const prompt = require("prompt-sync")();
const chalk = require("chalk");
require("dotenv").config();
const cookie = require("cookie");
const { ModuleGraph } = require("vite");
const { signInUser, signUpUser } = require("../user_utils");

console.log("\n");
console.log(chalk.magenta("Your To Do App"));
console.log("  ----------");

async function userPrompts() {
  let user, cookieInfo;
  const userExists = prompt("Do you already have an account? (y/n) ");
  if (userExists === "y") {
    const email = prompt(chalk.yellow("Enter your email: "));
    const password = prompt.hide(chalk.yellow("Enter your password: "));
    [cookieInfo, user] = await signInUser(email, password);
  } else if (userExists === "n") {
    const firstName = prompt(chalk.yellow("Enter your first name: "));
    const lastName = prompt(chalk.yellow("Enter your last name: "));
    const email = prompt(chalk.yellow("Enter your email: "));
    const password = prompt.hide(chalk.yellow("Enter a password: "));
    [cookieInfo, user] = await signUpUser(firstName, lastName, email, password);
    console.log(cookieInfo, user);
  }
  console.log(`Welcome, ${user.firstName}!`);
  return [user, cookieInfo];
}

function logCommands() {
  console.log("\n");
  console.log(`Here are some commands to get you started:`);
  console.log(`list: list all of your todos`);
  console.log(`create [task]: create a new todo`);
  console.log(`complete [id]: complete a task on your todo list`);
  console.log(`remove [id]: remove a task from your todo list`);
  console.log(`logout: log out of your account`);
  console.log("help: see this list again");
  console.log("  --------------");
}

// function run(user, cookieInfo) {
//   usedCommands = [];
//   do {
//     const command = prompt(chalk.blue("What would you like to do? "));
//   } while (!usedCommands.includes("logout"));
// }

(async () => {
  const [user, cookieInfo] = await userPrompts();
  logCommands();
  // run(user, cookieInfo);
})();

module.exports = { cookieInfo, user };
