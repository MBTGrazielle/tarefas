const mongoose = require('mongoose');
const moment = require('moment');

const TarefaSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  lista_id: { type: Number, required: true },
  sublista_id: { type: Number },
  titulo: { type: String, required: true },
  descricao: { type: String },
  alocado: { type: String, required: true },
  data_criacao: { type: Date, default: Date.now },
  tipo: { type: String, required: true },
});

TarefaSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.data_criacao = moment(ret.data_criacao).format('DD/MM/YYYY HH:mm:ss');
    return ret;
  },
});

module.exports = mongoose.model('Tarefa', TarefaSchema);
