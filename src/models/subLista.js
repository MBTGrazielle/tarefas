const mongoose = require("mongoose");
const moment = require("moment");

const SubTarefa = new mongoose.Schema({
  lista_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lista" },
  titulo: { type: String, required: true },
  data_criacao: { type: Date, default: Date.now },
});

SubTarefa.set("toJSON", {
  transform: function (doc, ret) {
    ret.createdAt = moment(ret.createdAt).format("DD/MM/YYYY HH:mm:ss");
    return ret;
  },
});

module.exports = mongoose.model("SubTarefa", SubTarefa);
