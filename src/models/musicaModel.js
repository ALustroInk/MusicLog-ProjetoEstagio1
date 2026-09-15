var database = require("../database/config");

function listar() {
    var instrucaoSql = `
        SELECT idMusicas, nome, artista, genero, nota, data_criacao, data_edicao
        FROM musicas
        ORDER BY data_criacao DESC
    `;
    return database.executarSeguro(instrucaoSql, []);
}

function buscarPorId(id) {
    var instrucaoSql = `
        SELECT idMusicas, nome, artista, genero, nota, data_criacao, data_edicao
        FROM musicas
        WHERE idMusicas = ?
    `;
    return database.executarSeguro(instrucaoSql, [id]);
}

function cadastrar(nome, artista, genero, nota) {
    var instrucaoSql = `
        INSERT INTO musicas (nome, artista, genero, nota)
        VALUES (?, ?, ?, ?)
    `;
    return database.executarSeguro(instrucaoSql, [nome, artista, genero, nota]);
}

function editar(id, nome, artista, genero, nota) {
    var instrucaoSql = `
        UPDATE musicas
        SET nome = ?, artista = ?, genero = ?, nota = ?, data_edicao = NOW()
        WHERE idMusicas = ?
    `;
    return database.executarSeguro(instrucaoSql, [nome, artista, genero, nota, id]);
}

function deletar(id) {
    var instrucaoSql = `DELETE FROM musicas WHERE idMusicas = ?`;
    return database.executarSeguro(instrucaoSql, [id]);
}

module.exports = {
    listar,
    buscarPorId,
    cadastrar,
    editar,
    deletar
};