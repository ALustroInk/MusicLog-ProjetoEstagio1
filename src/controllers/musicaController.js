var musicaModel = require("../models/musicaModel");

function listar(req, res) {
    musicaModel.listar()
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar as músicas: ", erro.sqlMessage);
            res.status(500).json({ mensagem: "Erro ao buscar músicas", erro: erro.sqlMessage });
        });
}

function buscarPorId(req, res) {
    var id = req.params.id;

    musicaModel.buscarPorId(id)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado[0]);
            } else {
                res.status(404).json({ mensagem: "Música não encontrada" });
            }
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ mensagem: "Erro ao buscar música", erro: erro.sqlMessage });
        });
}

function cadastrar(req, res) {
    var nome = req.body.nome;
    var artista = req.body.artista;
    var genero = req.body.genero;
    var nota = req.body.nota;

    if (!nome || !artista || !genero || !nota) {
        return res.status(400).json({ mensagem: "Preencha nome, artista, gênero e nota." });
    }
    if (nota < 1 || nota > 5) {
        return res.status(400).json({ mensagem: "A nota deve ser entre 1 e 5." });
    }

    musicaModel.cadastrar(nome, artista, genero, nota)
        .then(function (resultado) {
            res.status(201).json({
                id: resultado.insertId,
                nome: nome,
                artista: artista,
                genero: genero,
                nota: nota
            });
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao cadastrar a música: ", erro.sqlMessage);
            res.status(500).json({ mensagem: "Erro ao cadastrar música", erro: erro.sqlMessage });
        });
}

function editar(req, res) {
    var id = req.params.id;
    var nome = req.body.nome;
    var artista = req.body.artista;
    var genero = req.body.genero;
    var nota = req.body.nota;

    if (!nome || !artista || !genero || !nota) {
        return res.status(400).json({ mensagem: "Preencha nome, artista, gênero e nota." });
    }

    musicaModel.editar(id, nome, artista, genero, nota)
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ mensagem: "Música não encontrada" });
            }
            res.status(200).json({ mensagem: "Música atualizada com sucesso" });
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao editar a música: ", erro.sqlMessage);
            res.status(500).json({ mensagem: "Erro ao editar música", erro: erro.sqlMessage });
        });
}

function deletar(req, res) {
    var id = req.params.id;

    musicaModel.deletar(id)
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ mensagem: "Música não encontrada" });
            }
            res.status(200).json({ mensagem: "Música removida com sucesso" });
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao excluir a música: ", erro.sqlMessage);
            res.status(500).json({ mensagem: "Erro ao excluir música", erro: erro.sqlMessage });
        });
}

module.exports = {
    listar,
    buscarPorId,
    cadastrar,
    editar,
    deletar
};