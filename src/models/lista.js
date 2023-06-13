const mongoose = require('mongoose');
const moment = require('moment');

const ListaSchema = new mongoose.Schema({
  id: {
    type: Number,
    default: 1,
    unique: true,
  },
  data_criacao: { type: Date, default: Date.now },
  titulo: { type: String, required: true },
  tipo: { type: String, required: true },
});

ListaSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.data_criacao = moment(ret.data_criacao).format('DD/MM/YYYY HH:mm:ss');
    return ret;
  },
});

module.exports = mongoose.model('Lista', ListaSchema);
