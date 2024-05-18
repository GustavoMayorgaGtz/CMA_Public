const Modbus = require('./Modbus');
const { validateInput } = require('../validations/validations');
const { create, getAll, getOne } = require('./controller');
const { getValue_Modbus_Var } = require('./modbus_functions');
const MODBUS_FUNCTIONS_CLASS = require('./modbus_functions');


const router = require('express').Router();

//Ruta para obtener todas las variables modbus
router.get("/getAll", (req, res) => {
  getAll()
    .then((variables) => {
      // const modbus_functipons = new Modbus_Functions();
      const modbus_vars = variables;
      //Definir el tamaño del arreglo
      const array_size = variables.length;
      if (array_size > 0) {
        const modbus_functions = new MODBUS_FUNCTIONS_CLASS();
        modbus_functions.getValue_Modbus_Var(modbus_vars)
          .then((modbus_variables) => {
            res.status(200).send(modbus_variables)
          })
          .catch((err) => {
            console.log("ERROR EN MODBUS: ", err)
            console.log("Error al obtener los valores de las variables, problemente no hay")
            res.status(500).send(err);
          })
      } else {
        console.log("NO HAY VARIABLES MODBUS");
        res.status(200).send([]);
      }

    })
    .catch((err) => {
      console.log("ERROR EN MODBUS: ", err)
      res.status(500).send("Server internal error | err: " + err);
    })
})



//Ruta para obtener todas las variables modbus
router.get("/getOne", (req, res) => {
  // console.log("Peticion de la ruta getOne modbus");
  // console.log(req.query);
  const idmodbusvar = req.query.idmodbusvar;
  if (idmodbusvar) {
    getOne(idmodbusvar)
      .then((variable) => {
        const modbus_functions = new MODBUS_FUNCTIONS_CLASS();
        modbus_functions.getValue_Modbus_Var(variable.rows)
          .then((modbus_variables) => {
            res.status(200).send(modbus_variables)
          })
          .catch((err) => {
            console.log(err)
            console.log("Error al obtener los valores de las variables, problemente no hay")
            res.status(204).send(err);
          })
      })
      .catch((err) => {
        res.status(500).send("Server internal error | err: " + err);
      })
  }
})




function getOneModbusVarValueLocal(idmodbusvar) {
  return new Promise((resolve, reject) => {
    if (idmodbusvar) {
      getOne(idmodbusvar)
        .then((variable) => {
          if (variable.rows.length > 0) {
            const current_variable = variable.rows[0];
            const modbus_functions = new MODBUS_FUNCTIONS_CLASS();
            modbus_functions.getValue_Modbus_Var([current_variable])
              .then((modbus_variables) => {
                resolve(modbus_variables)
              })
              .catch((err) => {
                console.log("Error al obtener los valores de las variables, problemente no hay")
                reject.status(204).send(err);
              })
          } else {
            reject(false);
          }
        })
        .catch((err) => {
          reject(err);
        })
    }
  })
}


//Ruta para crear una variable modbus
router.post("/create", (req, res) => {
  //console.log("-> Creando variable modbus")
  //Llegada de datos 
  const name = req.body.name;
  const ip = req.body.ip;
  const port = req.body.port;
  const no_register = req.body.no_register;
  //console.log("No de registro: ", no_register);
  //Verificacion de datos obligatorios
  if (validateInput(name, "string", 255)
    && validateInput(ip, "string", 15)
    && validateInput(port, "number")
    && (validateInput(no_register, "number") || no_register == 0)
  ) {
    Test_Connect_Value(ip, port, no_register).then((value) => {
      create(name
        , ip
        , port
        , no_register
      )
        .then((response) => {
          if (response.rowCount >= 1) {
           // console.log("Se creo la variable modbus")
            res.status(200).send({ state: 200, message: "No se pudo conectar al dispositivo" })
          } else {
            res.status(400).send("No se pudo insertar el elemento");
          }
        })
        .catch((err) => {
          if (err.code == "23505") {
            res.status(409).send("nombre duplicado");
          } else {
            res.status(500).send("Server internal error");
          }
        })
    }).catch((body_err) => {
      res.status(400).send(body_err);
    })
  } else {
    console.log("-> No se pudo crear la variable modbus - Bad request")
    res.status(400).send("Bad request");
  }
})

router.post("/testConnection", (req, res) => {
  const ip = req.body.ip;
  const port = req.body.port;
  const no_register = req.body.no_register;
  //Verificacion de datos obligatorios
  if (validateInput(ip, "string", 15)
    && validateInput(port, "number")
    && (validateInput(no_register, "number") || no_register == 0)
  ) {
    Test_Connect_Value(ip, port, no_register).then((body) => {
      res.status(200).send(body);
    })
      .catch((body_err) => {
        res.status(400).send(body_err);
      })
  } else {
    console.log("-> No se pudo crear la variable modbus - Bad request")
    res.status(400).send({ state: 3, message: "Faltan datos para procesar." });
  }

})


function Test_Connect_Value(ip, port, no_register) {
  return new Promise((resolve, reject) => {
    //Verificar la onexion con modbus
    const Modbus = require("./Modbus");
    const modbus = new Modbus(ip, port);
    modbus.connect()
      .then((isConnected) => {
        if (isConnected) {
         // console.log("Se conecto al dispositivo")
          //Obtener valor del registro que se mando
          modbus.getData(no_register)
            .then((value) => {
             // console.log("El valor es: ", value);
              //   modbus.disconnect();
              resolve({ state: 200, message: value });
            })
            .catch((err) => {
              console.log("Error al obtener el valor del dispositivo", err);
              reject({ state: 1, message: "Se pudo conectar al dispositivo, pero no se puedo obtener el valor." });
            })
        } else {
          console.log("No se pudo conectar")
          reject({ state: 2, message: "No se pudo conectar al dispositivo." });
        }
      })
  })

}

module.exports = { router, getOneModbusVarValueLocal };