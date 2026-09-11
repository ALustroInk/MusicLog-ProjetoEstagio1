var express = require("express");
var router = express.Router();
var musicaController = require("../controllers/musicaController");

router.get("/", musicaController.listar);
router.get("/:id", musicaController.buscarPorId);
router.post("/", musicaController.cadastrar);
router.put("/:id", musicaController.editar);
router.delete("/:id", musicaController.deletar);

module.exports = router;