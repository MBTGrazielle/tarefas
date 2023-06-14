const ListaSchema = require('../models/lista');
const SubListaSchema = require('../models/subLista');
const TarefaSchema = require('../models/tarefa');
const mongoose = require('mongoose');
const { generateAutoID } = require('../utils/generateAutoID');
const removeAccents = require('remove-accents');

const cadastrarLista = async (req, res) => {
  const { titulo, tipo } = req.body;

  try {
    const novoID = await generateAutoID();

    const novaLista = new ListaSchema({
      titulo,
      id: novoID,
      tipo: tipo,
    });

    await novaLista.save();

    res.status(201).json({
      mensagem: 'Lista criada com sucesso',
      status: 201,
      info: novaLista,
    });
  } catch (error) {
    res.status(500).json({
      mensagem: error.message,
      status: 500,
    });
  }
};

// const todasListas = async (req, res) => {
//   try {
//     const listas = await ListaSchema.find().sort({ data_criacao: -1 });

//     if (listas.length === 0) {
//       return res.status(404).json({
//         mensagem: 'Nenhuma lista foi encontrada.',
//         status: 404,
//       });
//     }

//     const listasComSublistas = [];

//     for (const lista of listas) {
//       const sublistas = await SubListaSchema.find({ lista_id: lista._id });
//       const sublistasComTarefas = [];

//       for (const sublista of sublistas) {
//         const tarefas = await TarefaSchema.find({ sublista_id: sublista._id });

//         const tarefasComOrigem = tarefas.map(tarefa => {
//           if (tarefa.lista_id.toString() === lista._id.toString()) {
//             return { ...tarefa._doc, origem: 'lista' };
//           } else {
//             return { ...tarefa._doc, origem: 'sublista' };
//           }
//         });

//         sublistasComTarefas.push({
//           sublista,
//           tarefas: tarefasComOrigem,
//         });
//       }

//       listasComSublistas.push({
//         lista,
//         sublistas: sublistasComTarefas,
//       });
//     }

//     res.status(200).json({
//       quantidade_encontrada: `Encontramos ${
//         listasComSublistas.length
//       } registro${listasComSublistas.length === 1 ? '' : 's'}.`,
//       mensagem: 'Listas encontradas.',
//       resultado: listasComSublistas,
//       status: 200,
//     });
//   } catch (error) {
//     res.status(500).json({
//       mensagem: 'Erro ao buscar as listas.',
//       status: 500,
//     });
//   }
// };

const todasListas = async (req, res) => {
  try {
    const listas = await ListaSchema.find().sort({ data_criacao: -1 });

    if (listas.length === 0) {
      return res.status(404).json({
        mensagem: 'Nenhuma lista foi encontrada.',
        status: 404,
      });
    }

    const listasComSublistas = [];

    for (const lista of listas) {
      const sublistas = await SubListaSchema.find({ lista_id: lista._id });
      const sublistasComTarefas = [];

      for (const sublista of sublistas) {
        const tarefas = await TarefaSchema.find({ sublista_id: sublista._id });

        const tarefasComOrigem = tarefas.map(tarefa => {
          return { ...tarefa._doc, origem: 'sublista' };
        });

        sublistasComTarefas.push({
          sublista,
          tarefas: tarefasComOrigem,
        });
      }

      const tarefasLista = await TarefaSchema.find({ lista_id: lista._id });

      const tarefasComOrigemLista = tarefasLista.map(tarefa => {
        return { ...tarefa._doc, origem: 'lista' };
      });

      listasComSublistas.push({
        lista,
        sublistas: sublistasComTarefas,
        tarefas: tarefasComOrigemLista,
      });
    }

    res.status(200).json({
      quantidade_encontrada: `Encontramos ${
        listasComSublistas.length
      } registro${listasComSublistas.length === 1 ? '' : 's'}.`,
      mensagem: 'Listas encontradas.',
      resultado: listasComSublistas,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro ao buscar as listas.',
      status: 500,
    });
  }
};

const buscarLista = async (req, res) => {
  const parametros = req.body;

  try {
    const listas = await ListaSchema.find().sort({ data_criacao: -1 });

    const listasFiltradas = listas.filter(lista => {
      const matches = Object.entries(parametros).every(
        ([chave, valorParametro]) => {
          const valorLista = lista[chave];

          if (
            valorLista &&
            removeAccents(valorLista.toString().toLowerCase()).includes(
              removeAccents(valorParametro.toString().toLowerCase())
            )
          ) {
            return true;
          }
        }
      );

      return matches;
    });

    if (listasFiltradas.length > 0) {
      return res.status(200).json({
        mensagem: `Encontramos ${listasFiltradas.length} resultado${
          listasFiltradas.length === 1 ? '' : 's'
        }.`,
        listasFiltradas,
        status: 200,
      });
    } else {
      return res.status(404).json({
        mensagem: 'Nenhum resultado foi encontrado para a sua busca.',
        status: 404,
      });
    }
  } catch (error) {
    res.status(500).json({
      mensagem: error.message,
    });
  }
};

const atualizarLista = async (req, res) => {
  const { id } = req.params;
  const { titulo, tipo } = req.body;

  try {
    const listaAtualizada = await ListaSchema.find({ id }).updateOne({
      titulo,
      tipo,
    });

    const response = await ListaSchema.findOne({ id });

    if (response === null) {
      return res
        .status(404)
        .json({ mensagem: 'Lista não encontrada.', status: 404 });
    }
    res.status(200).json({ lista: response, status: 200 });
  } catch (error) {
    res
      .status(500)
      .json({ mensagem: 'Erro ao atualizar a lista.', status: 500 });
  }
};

const deletarLista = async (req, res) => {
  try {
    const { id } = req.params;

    let listaExcluida = await ListaSchema.findOneAndDelete({ id });

    if (listaExcluida) {
      let listasRestantes = await ListaSchema.find().countDocuments();
      let nomesListas = await ListaSchema.find({}, 'titulo');

      return res.status(200).json({
        mensagem: 'Lista deletada com sucesso',
        listas_restantes: listasRestantes,
        listas: nomesListas.map(lista => lista.titulo),
        status: 200,
      });
    } else {
      return res.status(404).json({
        mensagem: 'Lista não encontrada',
        status: 404,
      });
    }
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro ao excluir a Lista.',
      status: 500,
    });
  }
};

module.exports = {
  cadastrarLista,
  todasListas,
  buscarLista,
  atualizarLista,
  deletarLista,
};
