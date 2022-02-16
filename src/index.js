const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.header;
  if(!username) {
    return response.status(404).json({ error: 'Mensagem do erro'})
  }
  request.username = username;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const newUser = { 
    id: uuidv4(),
    name,
    username,
    todos: []
  }
  const userAlreadyExists = users.some((user) => user.username === username)

  if(userAlreadyExists) {
    return response.status(400).json({ error: 'Mensagem do erro'});
  }

  users.push(newUser);
  return response.status(200).json(newUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.header;
  const findUser = users.find((user) => user.username === username);
  return response.status(200).json(findUser.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;