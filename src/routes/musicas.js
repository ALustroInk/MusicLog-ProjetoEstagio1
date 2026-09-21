var express = require("express");
var router = express.Router();
var musicaController = require("../controllers/musicaController");
var upload = require("../middlewares/upload");

router.get("/", musicaController.listar);
router.post("/", upload.single("capa"), musicaController.cadastrar);
router.put("/:id", upload.single("capa"), musicaController.editar);
router.delete("/:id", musicaController.deletar);

module.exports = router;