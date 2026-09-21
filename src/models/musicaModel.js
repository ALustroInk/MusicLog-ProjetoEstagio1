var database = require("../database/config");

function listarPorUsuario(idUsuario) {
    var instrucaoSql = `
        SELECT idMusicas, nome, artista, genero, nota, capa_url, data_criacao, data_edicao
        FROM musicas
        WHERE fk_usuario = ?
        ORDER BY data_criacao DESC
    `;
    return database.executarSeguro(instrucaoSql, [idUsuario]);
}

function buscarPorId(id, idUsuario) {
    var instrucaoSql = `
        SELECT idMusicas, nome, artista, genero, nota, capa_url, data_criacao, data_edicao
        FROM musicas
        WHERE idMusicas = ? AND fk_usuario = ?
    `;
    return database.executarSeguro(instrucaoSql, [id, idUsuario]);
}

function cadastrar(nome, artista, genero, nota, idUsuario, capaUrl) {
    var instrucaoSql = `
        INSERT INTO musicas (nome, artista, genero, nota, fk_usuario, capa_url)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    return database.executarSeguro(instrucaoSql, [nome, artista, genero, nota, idUsuario, capaUrl]);
}

function editar(id, nome, artista, genero, nota, idUsuario, capaUrl) {
    var instrucaoSql = `
        UPDATE musicas
        SET nome = ?, artista = ?, genero = ?, nota = ?, capa_url = ?, data_edicao = NOW()
        WHERE idMusicas = ? AND fk_usuario = ?
    `;
    return database.executarSeguro(instrucaoSql, [nome, artista, genero, nota, capaUrl, id, idUsuario]);
}

function deletar(id, idUsuario) {
    var instrucaoSql = `DELETE FROM musicas WHERE idMusicas = ? AND fk_usuario = ?`;
    return database.executarSeguro(instrucaoSql, [id, idUsuario]);
}

module.exports = {
    listarPorUsuario,
    buscarPorId,
    cadastrar,
    editar,
    deletar
};