const { validateInput } = require('../validations/validations');
const { create, getAll: getAllJson, getJsonVarById } = require('./controller');
const { getAll: getAllModbus } = require('../MODBUSVARS/controller');
const Modbus = require('../MODBUSVARS/Modbus');

const router = require('express').Router();

//Ruta para obtener todas las variables json
router.get("/getAll", (req, res) => {
  let jsonVars;
  let modbusVars;
  getAllJson()
    .then((variables) => {
      jsonVars = variables.rows;

      res.json({ json: jsonVars });
    })
    .catch((err) => {
      console.log("Error json var", err)
      //res.status(500).send("Server internal error | err: "+err);
    })
})


router.get("/getOne", (req, res) => {
  const idjsonvar = req.query.idjsonvar;
  if (idjsonvar) {
    getJsonVarById(idjsonvar)
      .then((response) => {
        res.status(200).send(response.rows);
      })
      .catch((err) => {
        res.status(500).send(err);
      })
  } else {
       res.status(400).send("Bad request.")
  }
})





//Ruta para crear una variable json
router.post("/create", (req, res) => {
  //console.log("-> Creando variable json")
  //Llegada de datos 
  const name = req.body.name;
  const url = req.body.url;
  const method = req.body.method;
  const body_json = req.body.body_json; //Esto se llama body en la base de datos //arreglo de objetos
  const token_bearer = req.body.token_bearer;
  const key_json = req.body.key_json;
  const father_keys_json_array = req.body.father_keys_json_array; //arreglo de string
  // const time_reload_number = req.body.time_reload_number;
  // const time_reload_type = req.body.time_reload_type;

  //Verificacion de datos obligatorios
  if (validateInput(name, "string", 255)
    && validateInput(url, "string", 255)
    && validateInput(method, "string", 20)
    && validateInput(key_json, "string", 255)
    && father_keys_json_array
    // && (validateInput(time_reload_number, "number") || time_reload_number === 0)
    // && validateInput(time_reload_type, "string", 50)
  ) {
    create(name
      , url
      , method
      , body_json
      , token_bearer
      , key_json
      , father_keys_json_array
    )
      .then((response) => {
        if (response.rowCount >= 1) {
          res.status(200).send(response.rows);
        } else {
          res.status(400).send("No se pudo insertar el elemento");
        }
      })
      .catch((err) => {
        if (err.code == "23505") {
          res.status(400).send("nombre duplicado");
        } else {
          res.status(500).send("Server internal error");
        }
      })
  } else {
    console.log("-> No se pudo crear la variable json - Bad request")
    console.log(req.body.name,
      req.body.url,
      req.body.method,
      req.body.key_json,
      req.body.father_keys_json_array);
    res.status(400).send("Bad request");
  }
})

module.exports = router;