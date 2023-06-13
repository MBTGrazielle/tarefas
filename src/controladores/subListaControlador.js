const mongoose = require('mongoose');
const SubListaSchema = require('../models/subLista');
const ListaSchema = require('../models/lista');
const TarefasSchema = require('../models/tarefa');
const { generateAutoID } = require('../utils/generateAutoID');

const cadastrarSubListas = async (req, res) => {
  const { lista_id, titulo } = req.body;

  try {
    const novoID = await generateAutoID();

    const listaExistente = await ListaSchema.findOne({ id: lista_id });

    if (!listaExistente) {
      return res.status(404).json({ error: 'Lista não encontrada.' });
    }

    const novaSubLista = new SubListaSchema({
      id: novoID,
      titulo,
      lista_id: listaExistente._id, // Associando a sublista à lista correspondente
      tipo: 'subLista',
    });

    await novaSubLista.save();

    res.status(201).json({
      mensagem: 'Sublista criada com sucesso',
      sublista: novaSubLista,
      status: 201,
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensagem: 'Erro ao cadastrar a subLista.', status: 500 });
  }
};

const todasSubListas = async (req, res) => {
  try {
    const sublistas = await SubListaSchema.find().sort({ data_criacao: -1 });

    if (sublistas.length === 0) {
      return res.status(404).json({
        mensagem: 'Nenhuma sublista foi encontrada.',
        status: 404,
      });
    }

    const subListasComTarefas = [];

    for (const sublista of sublistas) {
      const tarefas = await TarefasSchema.find({ lista_id: lista._id });
      subListasComTarefas.push({
        sublista,
        tarefas,
      });
    }

    res.status(200).json({
      quantidade_encontrada: `Encontramos ${
        subListasComTarefas.length
      } registro${subListasComTarefas.length === 1 ? '' : 's'}.`,
      mensagem: 'SubListas encontradas.',
      subListas: subListasComTarefas,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro ao buscar as sublistas.',
      status: 500,
    });
  }
};
const buscarSubLista = async (req, res) => {};

const atualizarSubLista = async (req, res) => {
  const { id } = req.params;
  const { titulo } = req.body;

  try {
    const subListaAtualizada = await SubListaSchema.find({ id }).updateOne({
      titulo,
    });

    const response = await SubListaSchema.findOne({ id });

    if (!subListaAtualizada) {
      return res.status(404).json({ error: 'Lista não encontrada.' });
    }
    res.status(200).json({ lista: response });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar a lista.' });
  }
};

const deletarSubLista = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID inválido.' });
    }

    let lista = await SubListaSchema.findOne({ id }).deleteOne();

    if (lista.deletedCount === 1) {
      return res
        .status(200)
        .json({ mensagem: `Lista deletada com sucesso`, status: 200 });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir a Lista.' });
  }
};

module.exports = {
  cadastrarSubListas,
  todasSubListas,
  buscarSubLista,
  atualizarSubLista,
  deletarSubLista,
};
