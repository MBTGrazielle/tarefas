const ListaSchema = require("../models/lista");
const mongoose = require("mongoose");

function generateAutoID() {
  const timestamp = new Date().getTime().toString();
  const randomNum = Math.floor(Math.random() * 1000).toString();
  const autoID = timestamp + randomNum;
  return autoID;
}

const cadastarLista = async (req, res) => {
  const { titulo } = req.body;

  try {
    const novaLista = new ListaSchema({ titulo, id: generateAutoID() });

    let listaSalva = await novaLista.save();

    let lista = {
      titulo: listaSalva.titulo,
      id: generateAutoID(),
      data_criacao: listaSalva.createdAt,
    };

    console.log(lista);

    res.status(201).json({
      Msg: "Lista Criada com sucesso",
      status: 201,
      Info: lista,
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
    const listas = await ListaSchema.find();
    res.status(200).json(listas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as listas." });
  }
};

const buscarLista = async (req, res) => {};

const atualizarLista = async (req, res) => {
  const { id } = req.params;
  const { titulo } = req.body;

  try {
    const listaAtualizada = await ListaSchema.find({ id }).updateOne({
      titulo,
    });

    const response = await ListaSchema.findOne({ id });

    if (!listaAtualizada) {
      return res.status(404).json({ error: "Lista não encontrada." });
    }
    res.status(200).json({ lista: response });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar a lista." });
  }
};

const deletarLista = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID inválido." });
    }

    let lista = await ListaSchema.findOne({ id }).deleteOne();

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
  cadastarLista,
  todasListas,
  buscarLista,
  atualizarLista,
  deletarLista,
};
