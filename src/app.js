const express = require("express");
const { uuid, isUuid } = require('uuidv4');
const cors = require("cors");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function getRepositoryIndex(id) {
  return repositories.findIndex(repository => repository.id === id);
}

function validateRepositoryID(req, res, next) {
  const repositoryIndex = getRepositoryIndex(req.params.id);

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found.' });
  }
  
  return next();
}

app.use('/repositories/:id', validateRepositoryID);

app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const repository = { 
    id: uuid(), 
    title, 
    url, 
    techs,
    likes: 0 
  }

  repositories.push(repository);

  return res.json(repository);
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const repositoryIndex = getRepositoryIndex(id);
  const { title, url, techs } = req.body;

  const repository = {
    id,
    title,
    url,
    techs,
    likes: 0
  }

  repositories[repositoryIndex] = repository;

  return res.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const repositoryIndex = getRepositoryIndex(req.params.id);

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found.' });
  }

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const repositoryIndex = getRepositoryIndex(req.params.id);

  repositories[repositoryIndex].likes++;

  return res.json(repositories[repositoryIndex]);
});

module.exports = app;