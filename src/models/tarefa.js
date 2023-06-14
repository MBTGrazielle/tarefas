const mongoose = require('mongoose');
const moment = require('moment');

const TarefaSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  lista_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lista',
    required: true,
  },
  sublista_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SubLista' },
  titulo: { type: String, required: true },
  descricao: { type: String },
  alocado: { type: String, required: true },
  data_criacao: { type: Date, default: Date.now },
  data_entrega: { type: Date, default: Date.now },
  status: { type: String, required: true },
  prioridade: { type: Number, required: true },
  tipo: { type: String, required: true },
  origem: { type: String, required: true },
});

TarefaSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.data_criacao = moment(ret.data_criacao).format('DD/MM/YYYY HH:mm:ss');
    return ret;
  },
});

module.exports = mongoose.model('Tarefa', TarefaSchema);
