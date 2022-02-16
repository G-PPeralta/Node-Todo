const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find((u) => u.username === username);

  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }

  request.user = user;

  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;
  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };
  const userAlreadyExists = users.find((user) => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: "Username already exists" });
  }

  users.push(newUser);
  return response.status(201).json(newUser);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);
  return response.status(201).json(todo);
});

// É preciso alterar apenas o title e o deadline da tarefa que possua o id igual ao id presente nos parâmetros da rota.

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const findTodo = user.todos.find((todo) => todo.id === id);

  if (!findTodo) {
    return response
      .status(404)
      .json({ error: "Cannot update an nonexistent todo" });
  }

  findTodo.title = title;
  findTodo.deadline = new Date(deadline);
  return response.json(findTodo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const findTodo = user.todos.find((todo) => todo.id === id);

  if (!findTodo) {
    return response
      .status(404)
      .json({ error: "Cannot update an nonexistent todo" });
  }

  findTodo.done = true;

  return response.json(findTodo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const findTodoIndex = user.todos.findIndex((todo) => todo.id === id);

  if (findTodoIndex === -1) {
    return response.status(404).json({ error: "Todo not found" });
  }

  user.todos.splice(findTodoIndex, 1);

  return response.status(204).send();
});

module.exports = app;
