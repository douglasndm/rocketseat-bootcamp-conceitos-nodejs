const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function checkIfRepositoryExists(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(r => r.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository didn't found" });
  }

  request.repositoryIndex = repositoryIndex;

  next();
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);
  return response.status(201).json(repository);
});

app.put("/repositories/:id", checkIfRepositoryExists, (request, response) => {
  const { title, url, techs } = request.body;

  const { repositoryIndex } = request;

  const updatedRepository = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs
  }
  repositories[repositoryIndex] = updatedRepository;

  return response.status(200).json(updatedRepository);
});

app.delete("/repositories/:id", checkIfRepositoryExists, (request, response) => {
  const { repositoryIndex } = request;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkIfRepositoryExists, (request, response) => {
  const { repositoryIndex } = request;

  const newRepository = {
    ...repositories[repositoryIndex],
    likes: repositories[repositoryIndex].likes + 1,
  };

  repositories[repositoryIndex] = newRepository;

  return response.status(200).json(newRepository);
});

module.exports = app;
