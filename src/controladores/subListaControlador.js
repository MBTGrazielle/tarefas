const mongoose = require('mongoose');
const removeAccents = require('remove-accents');
const SubListaSchema = require('../models/subLista');
const ListaSchema = require('../models/lista');
const { generateAutoID } = require('../utils/generateAutoID');

const cadastrarSubListas = async (req, res) => {
  const { lista_id, titulo } = req.body;

  try {
    const novoID = await generateAutoID();

    const listaExistente = await ListaSchema.findOne({ id: lista_id });

    if (!listaExistente) {
      return res.status(404).json({
        mensagem: 'Para criar uma sublista é necessário criar uma lista.',
        status: 404,
      });
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
    const subListas = await SubListaSchema.find().sort({ data_criacao: -1 });

    if (subListas.length === 0) {
      return res.status(404).json({
        mensagem: 'Nenhuma sublista foi encontrada.',
        status: 404,
      });
    }

    res.status(200).json({
      quantidade_encontrada: `Encontramos ${subListas.length} registro${
        subListas.length === 1 ? '' : 's'
      }.`,
      mensagem: 'SubListas encontradas.',
      subListas: subListas,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro ao buscar as sublistas.',
      status: 500,
    });
  }
};

const buscarSubLista = async (req, res) => {
  const parametros = req.body;

  try {
    const subListas = await SubListaSchema.find().sort({ data_criacao: -1 });

    const subListasFiltradas = subListas.filter(lista => {
      const matches = Object.entries(parametros).every(
        ([chave, valorParametro]) => {
          const valorSubLista = lista[chave];

          if (
            valorSubLista &&
            removeAccents(valorSubLista.toString().toLowerCase()).includes(
              removeAccents(valorParametro.toString().toLowerCase())
            )
          ) {
            return true;
          }
        }
      );

      return matches;
    });

    if (subListasFiltradas.length > 0) {
      return res.status(200).json({
        mensagem: `Encontramos ${subListasFiltradas.length} resultado${
          subListasFiltradas.length === 1 ? '' : 's'
        }.`,
        subListasFiltradas,
        status: 200,
      });
    } else {
      return res.status(404).json({
        mensagem: 'Nenhum resultado foi encontrado para a sua busca.',
        status: 404,
      });
    }
  } catch (error) {
    res.status(500).json({
      mensagem: error.message,
    });
  }
};

const atualizarSubLista = async (req, res) => {
  const { id } = req.params;
  const { titulo } = req.body;

  try {
    const subListaAtualizada = await SubListaSchema.find({ id }).updateOne({
      titulo,
      tipo,
    });

    const response = await SubListaSchema.findOne({ id });

    if (response === null) {
      return res
        .status(404)
        .json({ mensagem: 'SubLista não encontrada.', status: 404 });
    }
    res
      .status(200)
      .json({
        mensagem: 'SubLista atualizada com sucesso!',
        subLista: response,
        status: 200,
      });
  } catch (error) {
    res
      .status(500)
      .json({ mensagem: 'Erro ao atualizar a subLista.', status: 500 });
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
