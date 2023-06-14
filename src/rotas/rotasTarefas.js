require('dotenv').config();

const { Router } = require('express');

const {
  cadastrarTarefas,
  todasTarefas,
  buscarTarefa,
  atualizarTarefa,
  deletarTarefa,
} = require('../controladores/tarefasControlador');

const rota = Router();

rota.post('/cadastrarTarefas', cadastrarTarefas);
rota.get('/todasTarefas', todasTarefas);
rota.get('/buscarTarefas', buscarTarefa);
rota.get('/buscarTarefa', buscarTarefa);
rota.patch('/atualizarTarefa/:id', atualizarTarefa);
rota.delete('/deletarTarefa/:id', deletarTarefa);

module.exports = rota;
