var musicaModel = require("../models/musicaModel");

function listar(req, res) {
    var idUsuario = req.query.idUsuario;

    if (!idUsuario) {
        return res.status(400).json({ mensagem: "Informe o idUsuario." });
    }

    musicaModel.listarPorUsuario(idUsuario)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ mensagem: "Erro ao buscar músicas", erro: erro.sqlMessage });
        });
}

function cadastrar(req, res) {
    var nome = req.body.nome;
    var artista = req.body.artista;
    var genero = req.body.genero;
    var nota = req.body.nota;
    var idUsuario = req.body.idUsuario;

    if (!nome || !artista || !genero || !nota || !idUsuario) {
        return res.status(400).json({ mensagem: "Preencha nome, artista, gênero, nota e esteja logado." });
    }
    if (nota < 1 || nota > 5) {
        return res.status(400).json({ mensagem: "A nota deve ser entre 1 e 5." });
    }

    musicaModel.cadastrar(nome, artista, genero, nota, idUsuario)
        .then(function (resultado) {
            res.status(201).json({
                idMusicas: resultado.insertId,
                nome: nome,
                artista: artista,
                genero: genero,
                nota: nota
            });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ mensagem: "Erro ao cadastrar música", erro: erro.sqlMessage });
        });
}

function editar(req, res) {
    var id = req.params.id;
    var nome = req.body.nome;
    var artista = req.body.artista;
    var genero = req.body.genero;
    var nota = req.body.nota;
    var idUsuario = req.body.idUsuario;

    if (!nome || !artista || !genero || !nota || !idUsuario) {
        return res.status(400).json({ mensagem: "Preencha nome, artista, gênero, nota e esteja logado." });
    }

    musicaModel.editar(id, nome, artista, genero, nota, idUsuario)
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ mensagem: "Música não encontrada" });
            }
            res.status(200).json({ mensagem: "Música atualizada com sucesso" });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ mensagem: "Erro ao editar música", erro: erro.sqlMessage });
        });
}

function deletar(req, res) {
    var id = req.params.id;
    var idUsuario = req.body.idUsuario;

    if (!idUsuario) {
        return res.status(400).json({ mensagem: "Informe o idUsuario." });
    }

    musicaModel.deletar(id, idUsuario)
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ mensagem: "Música não encontrada" });
            }
            res.status(200).json({ mensagem: "Música removida com sucesso" });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ mensagem: "Erro ao excluir música", erro: erro.sqlMessage });
        });
}

module.exports = {
    listar,
    cadastrar,
    editar,
    deletar
};