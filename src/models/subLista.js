const mongoose = require("mongoose");
const moment = require("moment");

const SubListaSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  lista_id: { type: Number, required: true },
  titulo: { type: String, required: true },
  data_criacao: { type: Date, default: Date.now },
});

SubListaSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.createdAt = moment(ret.createdAt).format("DD/MM/YYYY HH:mm:ss");
    return ret;
  },
});

module.exports = mongoose.model("SubTarefa", SubListaSchema);
