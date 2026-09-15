var database = require("../database/config");

function autenticar(email, senha) {
    var instrucaoSql = `
        SELECT idUsuarios, nome, email
        FROM usuarios
        WHERE email = ? AND senha = ?
    `;
    return database.executarSeguro(instrucaoSql, [email, senha]);
}

function cadastrar(nome, email, senha) {
    var instrucaoSql = `
        INSERT INTO usuarios (nome, email, senha)
        VALUES (?, ?, ?)
    `;
    return database.executarSeguro(instrucaoSql, [nome, email, senha]);
}

function buscarPorEmail(email) {
    var instrucaoSql = `
        SELECT idUsuarios, nome, email
        FROM usuarios
        WHERE email = ?
    `;
    return database.executarSeguro(instrucaoSql, [email]);
}

module.exports = {
    autenticar,
    cadastrar,
    buscarPorEmail
};