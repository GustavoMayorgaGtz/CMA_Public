const { getAllVarsGeneral } = require("./vars_controller");

const router = require("express").Router();

/**
 * Ruta para recuperar una lista de todas las variables creadas
 * Nos ayuda a identificar nombres duplicados, optimiza la busqueda de las variables simplificando
 * las peticiones a solo una, se vuelve mas agil encontrar una variable
 */
router.get("/get", (req, res) => {
    getAllVarsGeneral().then((vars) => {
        // console.log("Variables recuperadas: ", vars)
        res.status(200).send(vars);
    })
        .catch((err) => {
            console.log("Error al obtener variables: ", err);
            res.status(500).send(err);
        })
})

module.exports = router;