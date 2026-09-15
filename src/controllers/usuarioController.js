var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.email;
    var senha = req.body.senha;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Informe email e senha." });
    }

    usuarioModel.autenticar(email, senha)
        .then(function (resultado) {
            if (resultado.length === 1) {
                res.status(200).json({
                    id: resultado[0].idUsuarios,
                    nome: resultado[0].nome,
                    email: resultado[0].email
                });
            } else {
                res.status(403).json({ mensagem: "Email e/ou senha inválido(s)." });
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao realizar o login: ", erro.sqlMessage);
            res.status(500).json({ mensagem: "Erro ao autenticar", erro: erro.sqlMessage });
        });
}

function cadastrar(req, res) {
    var nome = req.body.nome;
    var email = req.body.email;
    var senha = req.body.senha;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "Preencha nome, email e senha." });
    }

    usuarioModel.buscarPorEmail(email)
        .then(function (existente) {
            if (existente.length > 0) {
                return res.status(409).json({ mensagem: "Já existe uma conta com esse email." });
            }

            usuarioModel.cadastrar(nome, email, senha)
                .then(function (resultado) {
                    res.status(201).json({
                        id: resultado.insertId,
                        nome: nome,
                        email: email
                    });
                })
                .catch(function (erro) {
                    console.log(erro);
                    console.log("Houve um erro ao cadastrar o usuário: ", erro.sqlMessage);
                    res.status(500).json({ mensagem: "Erro ao cadastrar usuário", erro: erro.sqlMessage });
                });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ mensagem: "Erro ao verificar email", erro: erro.sqlMessage });
        });
}

module.exports = {
    autenticar,
    cadastrar
};