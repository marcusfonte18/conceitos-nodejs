const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];  

function middlewareCheckRepoExists(request,response,next) {
   const { id } = request.params;

   const repoExist = repositories.find(repo => repo.id === id);

   if(!repoExist) {
     return response.status(400).json({error: 'Repository does not exist'})
   }

   request.repo = repoExist;

   return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
   const { title, url, techs } = request.body;

   const repository = {
     id: uuid(),
     title,
     techs, 
     url,
     likes: 0,
   };

   repositories.push(repository);

   return response.json(repository);

});

app.put("/repositories/:id", middlewareCheckRepoExists, (request, response) => {

  const {repo} = request;
  const {title, url, techs } = request.body;

  
  repo.title = title;
  repo.url = url;
  repo.techs = techs;

  
  return response.json(repo);

});

app.delete("/repositories/:id", middlewareCheckRepoExists, (request, response) => {
  const { id } = request.params;

  const repository = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repository, 1);

  
    return response.status(204).json({});
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repository = repositories.find(repository => repository.id === id);
  
  if (!repository) {
    return response.status(400).send();
  }

  repository.likes += 1;

  return response.json(repository)

});

module.exports = app;
