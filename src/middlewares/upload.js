var multer = require("multer");

var upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        var tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
        if (tiposPermitidos.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Formato de imagem não suportado. Use JPEG, PNG ou WEBP."));
        }
    }
});

module.exports = upload;