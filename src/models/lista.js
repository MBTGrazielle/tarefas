const mongoose = require("mongoose");

const moment = require("moment");

const ListaSchema = new mongoose.Schema({
  id: {
    type: Number,
    default: 1,
  },
  createdAt: { type: Date, default: Date.now },
  titulo: { type: String, required: true },
  tipo: { type: String, required: true },
});

ListaSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.createdAt = moment(ret.createdAt).format("DD/MM/YYYY HH:mm:ss");
    return ret;
  },
});

module.exports = mongoose.model("Lista", ListaSchema);
