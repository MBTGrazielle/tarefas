const mongoose = require('mongoose');
const SubListaSchema = require('../models/subLista');
const ListaSchema = require('../models/lista');
const TarefaSchema = require('../models/tarefa');
const { generateAutoID } = require('../utils/generateAutoID');

const cadastrarTarefas = async (req, res) => {
  const {
    lista_id,
    sublista_id,
    titulo,
    descricao,
    alocado,
    data_entrega,
    status,
    prioridade,
    tipo,
  } = req.body;

  try {
    const novoID = await generateAutoID();

    const listaExistente = await ListaSchema.findOne({ id: lista_id });

    if (!listaExistente) {
      return res.status(404).json({ error: 'Lista não encontrada.' });
    }

    let subListaExistente;
    if (sublista_id) {
      subListaExistente = await SubListaSchema.findOne({ id: sublista_id });
      if (!subListaExistente) {
        return res.status(404).json({ error: 'Sublista não encontrada.' });
      } else {
        const novaTarefa = new TarefaSchema({
          id: novoID,
          lista_id: listaExistente._id,
          sublista_id: subListaExistente ? subListaExistente._id : undefined,
          titulo,
          descricao,
          alocado,
          data_entrega,
          status,
          prioridade,
          tipo: tipo,
        });

        const tarefaSalva = await novaTarefa.save();

        res.status(201).json({
          mensagem: 'Tarefa criada com sucesso',
          tarefa: tarefaSalva,
          status: 201,
        });
      }
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensagem: 'Erro ao cadastrar a tarefa.', status: 500 });
  }
};

function unificarPorListaId(tarefas) {
  const unificado = {};

  tarefas.forEach(item => {
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

    // const tarefasFormatadas = unificarPorListaId(subListas);

    res.status(200).json(subListas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar as tarefas.' });
  }
};

const buscarTarefa = async (req, res) => {};

const atualizarTarefa = async (req, res) => {};

const deletarTarefa = async (req, res) => {
  try {
    const { id } = req.params;

    const tarefa = await TarefaSchema.findOne({ id }).deleteOne();

    if (tarefa) {
      return res.status(200).json({
        mensagem: 'Tarefa deletada com sucesso',
        status: 200,
      });
    } else {
      return res.status(404).json({
        mensagem: 'Tarefa não encontrada',
        status: 404,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensagem: 'Erro ao excluir a tarefa.',
      status: 500,
    });
  }
};

module.exports = {
  cadastrarTarefas,
  todasTarefas,
  buscarTarefa,
  atualizarTarefa,
  deletarTarefa,
};
