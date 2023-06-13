const mongoose = require("mongoose");
const SubListaSchema = require("../models/subLista");
const ListaSchema = require("../models/lista");
const TarefaSchema = require("../models/tarefa");

function generateAutoID() {
  const timestamp = new Date().getTime().toString();
  const randomNum = Math.floor(Math.random() * 1000).toString();
  const autoID = timestamp + randomNum;
  return autoID;
}

const cadastrarTarefasLista = async (req, res) => {
  try {
    const { lista_id, titulo, descricao, alocado } = req.body;

    const listaExistente = await ListaSchema.findOne({ id: lista_id });
    if (!listaExistente) {
      return res.status(404).json({ error: "Lista não encontrada." });
    }

    const novaTarefa = new TarefaSchema({
      id: generateAutoID(),
      titulo,
      lista_id: listaExistente.id,
      descricao,
      alocado,
      tipo: "tarefa",
    });

    const tarefaSalva = await novaTarefa.save();

    res.status(201).json(tarefaSalva);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao cadastrar a tarefa.", erro: error.message });
  }
};

const cadastrarTarefasSubLista = async (req, res) => {
  try {
    const { lista_id, sublista_id, titulo, descricao, alocado } = req.body;

    const listaExistente = await ListaSchema.findOne({ id: lista_id });

    const sublistaExistente = await SubListaSchema.findOne({ id: sublista_id });

    if (!listaExistente) {
      return res.status(404).json({ error: "Lista não encontrada." });
    }

    if (!sublistaExistente) {
      return res.status(404).json({ error: "SubLista não encontrada." });
    }

    if (sublistaExistente.lista_id !== listaExistente.id) {
      return res.status(404).json({ error: "Listas incompativeis." });
    }

    const novaTarefa = new TarefaSchema({
      id: generateAutoID(),
      titulo,
      lista_id: listaExistente.id,
      sublista_id: sublistaExistente.id,
      descricao,
      alocado,
      tipo: "tarefa",
    });
    const tarefaSalva = await novaTarefa.save();
    console.log(tarefaSalva);
    res.status(201).json(tarefaSalva);
  } catch (error) {
    res.status(500).json({ error: "Erro ao cadastrar a tarefa." });
  }
};

function unificarPorListaId(tarefas) {
  const unificado = {};

  tarefas.forEach((item) => {
    const listaId = item.lista_id;

    if (!unificado[listaId]) {
      unificado[listaId] = {
        lista_id: listaId,
        tarefasLista: [],
      };
    }

    unificado[listaId].tarefasLista.push(item);
  });

  return Object.values(unificado);
}

const todasTarefas = async (req, res) => {
  try {
    const subListas = await TarefaSchema.find();

    const tarefasFormatadas = unificarPorListaId(subListas);

    res.status(200).json(tarefasFormatadas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as tarefas." });
  }
};

const buscarTarefa = async (req, res) => {};

const atualizarTarefa = async (req, res) => {};

const deletarTarefa = async (req, res) => {};

module.exports = {
  cadastrarTarefasLista,
  cadastrarTarefasSubLista,
  todasTarefas,
  buscarTarefa,
  atualizarTarefa,
  deletarTarefa,
};
