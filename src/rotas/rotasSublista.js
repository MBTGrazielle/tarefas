require("dotenv").config();

const { Router } = require("express");

const {
  cadastrarSubListas,
  todasSubListas,
  buscarSubLista,
  atualizarSubLista,
  deletarSubLista,
} = require("../controladores/subListaControlador");

const rota = Router();

rota.post("/cadastrarSubListas", cadastrarSubListas);
rota.get("/todasSubListas", todasSubListas);
rota.get("/buscarSubLista", buscarSubLista);
rota.patch("/atualizarSubLista/:id", atualizarSubLista);
rota.delete("/deletarSubLista/:id", deletarSubLista);

module.exports = rota;
