require('dotenv').config();
const express = require("express");
const app = express();
const parser = require("body-parser");
const cors = require("cors");

//Conexion base de datos
require('./conexion_databse').connect();

//Configurar propiedades del servidor
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 1;
app.use(cors());
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));


//Ruta para las cma endpoint
const AuthRouter = require("./AUTH/auth.route");
app.use("/CMA_SERVER/auth", AuthRouter);

//Ruta para variables de json
const JsonRouter = require('./JSONVARS/router');
app.use("/CMA_SERVER/jsonvars", JsonRouter);

//Ruta para variables de memoria
const MemoryRouter = require('./MEMORYVARS/router');
app.use("/CMA_SERVER/memoryvars", MemoryRouter);

//Ruta para variables de modbus
const { router } = require("./MODBUSVARS/router")
app.use("/CMA_SERVER/modbusvars", router)

//Ruta para obtener todas las variables
const VarsRouter = require("./VARS/vars_router")
app.use("/CMA_SERVER/vars", VarsRouter)

//Ruta para tools
const LinerChartRouter = require("./TOOLS/LINECHART/linechart_router");
app.use("/CMA_SERVER/linechart", LinerChartRouter);

//Ruta para simple button
const SimpleButtonRouter = require("./TOOLS/SIMPLEBUTTON/simplebutton_router");
app.use("/CMA_SERVER/simplebutton", SimpleButtonRouter);

//Ruta para alerta
const AlertRouter = require("./ALERTS/SMS/sms.router");
app.use("/CMA_SERVER/alert", AlertRouter);


//Ruta para las cma endpoint
const CMA_ENDPOINT_Router = require("./CMAENDPOINTSVARS/cma_endpoint.router");
app.use("/CMA_SERVER/cma_endpoint", CMA_ENDPOINT_Router);

//Clase de monitoreo de alertas sms
const MONITORING_ALERT_SMS_CLASS = require("./ALERTS/SMS/monitoring_alert_sms_class");
const monitoring = new MONITORING_ALERT_SMS_CLASS();
//Ruta para el sistema de blob data en graficas
const BlobDataRouter = require('./BLOBDATA/router');
const { crearConexionesModbus } = require('./MODBUSVARS/conexiones_modbus');
app.use("/CMA_SERVER/blobdata", BlobDataRouter);

//CREAR CONEXIONES CON DISPOSITIVOS MODBUS
crearConexionesModbus();

//Clase para monitoreo de espacios virtuales
const MONITORING_BLOBDATA_CLASS = require('./MONITORINGBLOBDATA/monitoring.blobdata.class');
const monitoring_blobdata = new MONITORING_BLOBDATA_CLASS();

// function reloadMonitoring_blobdata(){
//     monitoring_blobdata.reloadInformation();
// }

app.get('/CMA_SERVER/getJsonExample1', (req, res) => {
  const edad = 15 * 2;
  const object = {
    nombre: "Jesus Garcia",
    edad: edad,
    datos: {
      tipo: "Entero",
      longitud: 50,
      assign: [
        {
          nombre: "Mayte Caldera",
          edad: 16
        },

      ]
    },
    parametros: {
      cors: true,
      longitudKB: 700,
      fecha: new Date()
    }
  }
  res.status(200).send(object);
})

app.get("/CMA_SERVER/btn", (req, res) => {
  console.log("Se hizo click aqui");
  res.status(200).send({ message: "click right" });
})


app.listen(5000, () => {
  console.log("Servidor listo!")
})