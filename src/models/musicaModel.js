var database = require("../database/config");

function listarPorUsuario(idUsuario) {
    var instrucaoSql = `
        SELECT idMusicas, nome, artista, genero, nota, data_criacao, data_edicao
        FROM musicas
        WHERE fk_usuario = ?
        ORDER BY data_criacao DESC
    `;
    return database.executarSeguro(instrucaoSql, [idUsuario]);
}

function cadastrar(nome, artista, genero, nota, idUsuario) {
    var instrucaoSql = `
        INSERT INTO musicas (nome, artista, genero, nota, fk_usuario)
        VALUES (?, ?, ?, ?, ?)
    `;
    return database.executarSeguro(instrucaoSql, [nome, artista, genero, nota, idUsuario]);
}

function editar(id, nome, artista, genero, nota, idUsuario) {
    var instrucaoSql = `
        UPDATE musicas
        SET nome = ?, artista = ?, genero = ?, nota = ?, data_edicao = NOW()
        WHERE idMusicas = ? AND fk_usuario = ?
    `;
    // o "AND fk_usuario = ?" garante que ninguém edite música de outra pessoa
    return database.executarSeguro(instrucaoSql, [nome, artista, genero, nota, id, idUsuario]);
}

function deletar(id, idUsuario) {
    var instrucaoSql = `DELETE FROM musicas WHERE idMusicas = ? AND fk_usuario = ?`;
    return database.executarSeguro(instrucaoSql, [id, idUsuario]);
}

module.exports = {
    listarPorUsuario,
    cadastrar,
    editar,
    deletar
};