var musicaModel = require("../models/musicaModel");
var s3Client = require("../config/s3");
var { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
var { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

var BUCKET = process.env.S3_BUCKET_NAME;
var URL_EXPIRA_EM_SEGUNDOS = 3600; // 1 hora

function subirImagem(idUsuario, arquivo) {
    var nomeSanitizado = arquivo.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "");
    var key = `capas/${idUsuario}-${Date.now()}-${nomeSanitizado}`;

    var comando = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: arquivo.buffer,
        ContentType: arquivo.mimetype
    });

    return s3Client.send(comando).then(function () {
        return key; // guardamos só a key no banco, não uma URL pública
    });
}

function apagarImagem(key) {
    if (!key) return Promise.resolve();

    var comando = new DeleteObjectCommand({ Bucket: BUCKET, Key: key });
    return s3Client.send(comando).catch(function (erro) {
        console.log("Aviso: não foi possível apagar a imagem antiga do S3:", erro.message);
    });
}

function gerarUrlAssinada(key) {
    if (!key) return Promise.resolve(null);

    var comando = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    return getSignedUrl(s3Client, comando, { expiresIn: URL_EXPIRA_EM_SEGUNDOS });
}

function listar(req, res) {
    var idUsuario = req.query.idUsuario;

    if (!idUsuario) {
        return res.status(400).json({ mensagem: "Informe o idUsuario." });
    }

    musicaModel.listarPorUsuario(idUsuario)
        .then(function (resultado) {
            return Promise.all(resultado.map(function (musica) {
                return gerarUrlAssinada(musica.capa_url).then(function (urlAssinada) {
                    musica.capa_url = urlAssinada;
                    return musica;
                });
            }));
        })
        .then(function (resultadoComUrls) {
            res.status(200).json(resultadoComUrls);
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

    var promessaCapa = req.file
        ? subirImagem(idUsuario, req.file)
        : Promise.resolve(null);

    promessaCapa
        .then(function (capaKey) {
            return musicaModel.cadastrar(nome, artista, genero, nota, idUsuario, capaKey)
                .then(function (resultado) {
                    return gerarUrlAssinada(capaKey).then(function (urlAssinada) {
                        res.status(201).json({
                            idMusicas: resultado.insertId,
                            nome: nome,
                            artista: artista,
                            genero: genero,
                            nota: nota,
                            capa_url: urlAssinada
                        });
                    });
                });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ mensagem: "Erro ao cadastrar música", erro: erro.message });
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

    musicaModel.buscarPorId(id, idUsuario)
        .then(function (existente) {
            if (existente.length === 0) {
                res.status(404).json({ mensagem: "Música não encontrada" });
                return null;
            }

            var capaAtual = existente[0].capa_url; // key salva no banco

            var promessaCapa = req.file
                ? subirImagem(idUsuario, req.file).then(function (novaKey) {
                    if (capaAtual) apagarImagem(capaAtual);
                    return novaKey;
                })
                : Promise.resolve(capaAtual);

            return promessaCapa.then(function (capaKey) {
                return musicaModel.editar(id, nome, artista, genero, nota, idUsuario, capaKey);
            });
        })
        .then(function (resultado) {
            if (!resultado) return;
            res.status(200).json({ mensagem: "Música atualizada com sucesso" });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ mensagem: "Erro ao editar música", erro: erro.message });
        });
}

function deletar(req, res) {
    var id = req.params.id;
    var idUsuario = req.body.idUsuario;

    if (!idUsuario) {
        return res.status(400).json({ mensagem: "Informe o idUsuario." });
    }

    musicaModel.buscarPorId(id, idUsuario)
        .then(function (existente) {
            var capaKey = existente.length > 0 ? existente[0].capa_url : null;

            return musicaModel.deletar(id, idUsuario).then(function (resultado) {
                if (resultado.affectedRows === 0) {
                    return res.status(404).json({ mensagem: "Música não encontrada" });
                }
                if (capaKey) apagarImagem(capaKey);
                res.status(200).json({ mensagem: "Música removida com sucesso" });
            });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ mensagem: "Erro ao excluir música", erro: erro.sqlMessage || erro.message });
        });
}

module.exports = {
    listar,
    cadastrar,
    editar,
    deletar
};