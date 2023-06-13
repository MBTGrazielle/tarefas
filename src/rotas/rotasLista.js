require("dotenv").config();

const { Router } = require("express");

const {
  cadastarLista,
  todasListas,
  buscarLista,
  atualizarLista,
  deletarLista,
} = require("../controladores/listaControlador");

const rota = Router();

rota.post("/cadastarLista", cadastarLista);
rota.get("/todasListas", todasListas);
rota.get("/buscarLista", buscarLista);
rota.patch("/atualizarLista/:id", atualizarLista);
rota.delete("/deletarLista/:id", deletarLista);

module.exports = rota;
