const ListaSchema = require('../models/lista');

async function generateAutoID() {
  try {
    const lista = await ListaSchema.findOne().sort({ id: -1 }).exec();
    if (lista && lista.id) {
      return lista.id + 1;
    } else {
      return 1;
    }
  } catch (error) {
    throw new Error('Erro ao gerar o ID automático');
  }
}

module.exports = {
  generateAutoID,
};
