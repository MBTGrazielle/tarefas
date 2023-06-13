require("dotenv").config();
const db = require("../src/db/conexao");
const express = require("express");
const rotasTarefas = require("./rotas/rotasTarefas");
const rotasLista = require("./rotas/rotasLista");
const rotasSubLista = require("./rotas/rotasSublista");

const cors = require("cors");

const app = express();

db.connect();
app.use(cors());
app.use(express.json());

app.use(rotasTarefas, rotasLista, rotasSubLista);

module.exports = app;
