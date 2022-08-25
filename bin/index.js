#!/usr/bin/env node
const prompt = require("prompt-sync")();
const chalk = require("chalk");
require("dotenv").config();
const cookie = require("cookie");
const { ModuleGraph } = require("vite");
const { listTodos, addTodo, deleteTodo } = require("../todo_utils");
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
  console.log(`add [task]: create a new todo`);
  console.log(`complete [id]: complete a task on your todo list`);
  console.log(`remove [task]: remove a task from your todo list`);
  console.log(`logout: log out of your account`);
  console.log("help: see this list again");
  console.log("  --------------");
}

async function run(user, cookieInfo) {
  usedCommands = [];
  const validCommands = ["list", "add", "complete", "remove", "help", "logout"];
  do {
    let command = prompt(chalk.blue("What would you like to do? "));
    let splitCommand = command.split(" ");
    splitCommand.shift();
    let task;
    while (!validCommands.includes(command.split(" ")[0])) {
      command = prompt("Please enter a valid command: ");
    }
    switch (command.split(" ")[0]) {
      case "list":
        const todos = await listTodos(cookieInfo);
        console.log(todos);
        break;
      case "add":
        if (splitCommand.length > 1) {
          task = splitCommand.join(" ");
        } else {
          task = splitCommand[0];
        }
        const newTodo = await addTodo(cookieInfo, task);
        console.log(`${task} has been added to your todo list!`);
        break;
      case "remove":
        if (splitCommand.length > 1) {
          task = splitCommand.join(" ");
        } else {
          task = splitCommand[0];
        }
        const userTodos = await listTodos(cookieInfo);
        const todoToBeDeleted = findTodoByTask(userTodos, task);
        await deleteTodo(cookieInfo, todoToBeDeleted.id);
        console.log(`${task} has been removed from your todo list!`);
        break;
    }
  } while (!usedCommands.includes("logout"));
}

function findTodoByTask(todos, task) {
  return todos.find((todo) => todo.task === task);
}

(async () => {
  const [user, cookieInfo] = await userPrompts();
  logCommands();
  run(user, cookieInfo);
})();
