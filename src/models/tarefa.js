const mongoose = require("mongoose");
const moment = require("moment");

const tarefaSchema = new mongoose.Schema({
  lista_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lista" },
  sublista_id: { type: mongoose.Schema.Types.ObjectId, ref: "Sublista" },
  titulo: { type: String, required: true },
  descricao: { type: String },
  alocado: { type: String, required: true, unique: true },
  data_criacao: { type: Date, default: Date.now },
  data_entrega: { type: Date, default: Date.now },
});

tarefaSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.createdAt = moment(ret.createdAt).format("DD/MM/YYYY HH:mm:ss");
    return ret;
  },
});

module.exports = mongoose.model("Tarefa", tarefaSchema);
