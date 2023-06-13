const ListaSchema = require('../models/lista');
const mongoose = require('mongoose');
const { generateAutoID } = require('../utils/generateAutoID');

const cadastrarLista = async (req, res) => {
  const { titulo, tipo } = req.body;

  try {
    const novoID = await generateAutoID();

    const novaLista = new ListaSchema({
      titulo,
      id: novoID,
      tipo: tipo,
    });

    await novaLista.save();

    res.status(201).json({
      mensagem: 'Lista criada com sucesso',
      status: 201,
      info: novaLista,
    });
  } catch (error) {
    res.status(500).json({
      mensagem: error.message,
      status: 500,
    });
  }
};

const todasListas = async (req, res) => {
  try {
    const listas = await ListaSchema.find().sort({ data_criacao: -1 });
    if (listas.length === 0) {
      res.status(404).json({
        mensagem: 'Nenhuma lista foi encontrada.',
        status: 404,
      });
    } else {
      res.status(200).json({
        quantidade_encontrada: `Encontramos ${listas.length} registro${
          listas.length === 1 ? '' : 's'
        }.`,
        mensagem: 'Listas encontradas.',
        listas,
        status: 200,
      });
    }
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro ao buscar as listas.',
      status: 500,
    });
  }
};

const buscarLista = async (req, res) => {};

const atualizarLista = async (req, res) => {
  const { id } = req.params;
  const { titulo, tipo } = req.body;

  try {
    const listaAtualizada = await ListaSchema.find({ id }).updateOne({
      titulo,
      tipo,
    });

    const response = await ListaSchema.findOne({ id });

    if (response === null) {
      return res
        .status(404)
        .json({ mensagem: 'Lista não encontrada.', status: 404 });
    }
    res.status(200).json({ lista: response, status: 200 });
  } catch (error) {
    res
      .status(500)
      .json({ mensagem: 'Erro ao atualizar a lista.', status: 500 });
  }
};

const deletarLista = async (req, res) => {
  try {
    const { id } = req.params;

    let listaExcluida = await ListaSchema.findOneAndDelete({ id });

    if (listaExcluida) {
      let listasRestantes = await ListaSchema.find().countDocuments();
      let nomesListas = await ListaSchema.find({}, 'titulo');

      return res.status(200).json({
        mensagem: 'Lista deletada com sucesso',
        listas_restantes: listasRestantes,
        listas: nomesListas.map(lista => lista.titulo),
        status: 200,
      });
    } else {
      return res.status(404).json({
        mensagem: 'Lista não encontrada',
        status: 404,
      });
    }
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro ao excluir a Lista.',
      status: 500,
    });
  }
};

module.exports = {
  cadastrarLista,
  todasListas,
  buscarLista,
  atualizarLista,
  deletarLista,
};
