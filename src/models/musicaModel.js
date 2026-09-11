var database = require("../database/config");

function listar() {
    var instrucaoSql = `
        SELECT id, nome, artista, genero, nota, data_criacao, data_edicao
        FROM musica
        ORDER BY data_criacao DESC
    `;
    return database.executarSeguro(instrucaoSql, []);
}

function buscarPorId(id) {
    var instrucaoSql = `
        SELECT id, nome, artista, genero, nota, data_criacao, data_edicao
        FROM musica
        WHERE id = ?
    `;
    return database.executarSeguro(instrucaoSql, [id]);
}

function cadastrar(nome, artista, genero, nota) {
    var instrucaoSql = `
        INSERT INTO musica (nome, artista, genero, nota)
        VALUES (?, ?, ?, ?)
    `;
    return database.executarSeguro(instrucaoSql, [nome, artista, genero, nota]);
}

function editar(id, nome, artista, genero, nota) {
    var instrucaoSql = `
        UPDATE musica
        SET nome = ?, artista = ?, genero = ?, nota = ?, data_edicao = NOW()
        WHERE id = ?
    `;
    return database.executarSeguro(instrucaoSql, [nome, artista, genero, nota, id]);
}

function deletar(id) {
    var instrucaoSql = `DELETE FROM musica WHERE id = ?`;
    return database.executarSeguro(instrucaoSql, [id]);
}

module.exports = {
    listar,
    buscarPorId,
    cadastrar,
    editar,
    deletar
};