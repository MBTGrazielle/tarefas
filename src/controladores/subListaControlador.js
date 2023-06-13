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

const atualizarSubLista = async (req, res) => {};

const deletarSubLista = async (req, res) => {};

module.exports = {
  cadastrarSubListas,
  todasSubListas,
  buscarSubLista,
  atualizarSubLista,
  deletarSubLista,
};
