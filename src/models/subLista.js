const mongoose = require('mongoose');
const moment = require('moment');

const SubListaSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  lista_id: { type: Number, required: true },
  titulo: { type: String, required: true },
  data_criacao: { type: Date, default: Date.now },
  tipo: { type: String, required: true },
});

SubListaSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.data_criacao = moment(ret.data_criacao).format('DD/MM/YYYY HH:mm:ss');
    return ret;
  },
});

module.exports = mongoose.model('SubTarefa', SubListaSchema);
