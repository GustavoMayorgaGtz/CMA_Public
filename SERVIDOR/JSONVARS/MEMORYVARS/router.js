const { validateInput } = require('../validations/validations');
const { create, getAll, getMemoryVarById} = require('./controller');
const router = require('express').Router();

//Ruta para obtener todas las variables json
router.get("/getAll", (req, res) => {
    getAll()
    .then((memory_vars) => {
       res.status(200).send(
        memory_vars);
    })
    .catch((err) => {
      console.log(`Error al obtener las variables de memoria, error: ${err}`)
      res.status(500).send({err:"Server internal error"});
    })
})


/**
 * Ruta para obtener una variable de memoria por el id
 */
router.get("/getOne", (req, res) => {
  const idmemoryvar = req.query.idmemoryvar;
  if (idmemoryvar) {
    getMemoryVarById(idmemoryvar)
      .then((response) => {
        res.status(200).send(response.rows);
      })
      .catch((err) => {
        res.status(500).send({err});
      })
  } else {
       res.status(400).send({err:"Bad request."})
  }
})





//Ruta para crear una variable memoria
router.post("/create", (req, res) => {
 // console.log("-> Creando variable memoria")
  //Llegada de datos 
  const name = req.body.name;
  const expression = req.body.expression;
 // console.log(req.body)
  //Verificacion de datos obligatorios
  if (validateInput(name, "string", 255)
    && expression
  ) {
    create(name
      , expression
    )
      .then((response) => {
        if (response.rowCount >= 1) {
          res.status(200).send({done: true})
        } else {
          res.status(400).send({err:"No se pudo insertar el elemento"});
        }
      })
      .catch((err) => {
        if (err.code == "23505") {
          res.status(400).send({err:"nombre duplicado"});
        } else {
          res.status(500).send({err:"Server internal error"});
        }
      })
  } else {
    console.log("-> No se pudo crear la variable de memoria - Bad request")    
    res.status(400).send({err:"Bad request"});
  }
})

module.exports = router;