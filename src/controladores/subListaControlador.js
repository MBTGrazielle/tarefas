const mongoose = require("mongoose");
const SubListaSchema = require("../models/subLista");
const ListaSchema = require("../models/lista");

function generateAutoID() {
  const timestamp = new Date().getTime().toString();
  const randomNum = Math.floor(Math.random() * 1000).toString();
  const autoID = timestamp + randomNum;
  return autoID;
}

const cadastrarSubListas = async (req, res) => {
  try {
    const { lista_id, titulo } = req.body;

    const listaExistente = await ListaSchema.findOne({ id: lista_id });

    if (!listaExistente) {
      return res.status(404).json({ error: "Lista não encontrada." });
    }

    const novaSubLista = new SubListaSchema({
      id: generateAutoID(),
      titulo,
      lista_id: listaExistente.id,
    });

    console.log(novaSubLista);

    const subListaSalva = await novaSubLista.save();

    res.status(201).json(subListaSalva);
  } catch (error) {
    res.status(500).json({ error: "Erro ao cadastrar a subLista." });
  }
};

const todasSubListas = async (req, res) => {
  try {
    const subListas = await SubListaSchema.find();
    res.status(200).json(subListas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as subListas." });
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
      return res.status(404).json({ error: "Lista não encontrada." });
    }
    res.status(200).json({ lista: response });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar a lista." });
  }
};

const deletarSubLista = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID inválido." });
    }

    let lista = await SubListaSchema.findOne({ id }).deleteOne();

    if (lista.deletedCount === 1) {
      return res
        .status(200)
        .json({ mensagem: `Lista deletada com sucesso`, status: 200 });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir a Lista." });
  }
};

module.exports = {
  cadastrarSubListas,
  todasSubListas,
  buscarSubLista,
  atualizarSubLista,
  deletarSubLista,
};
