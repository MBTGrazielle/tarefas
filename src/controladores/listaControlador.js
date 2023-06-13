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

module.exports = {
  cadastarLista,
};
