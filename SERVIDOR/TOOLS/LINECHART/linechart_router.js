const { validateInput } = require('../../validations/validations');
const LineChart = require('./linechart');
const { create_Line_Chart, getOneById, getAll, updatePositions } = require('./linechart_controller');

const router = require('express').Router();

router.post('/create', (req, res) => {
   let lineChart = new LineChart();
   if (!req.body.general) {
      res.status(400).send({ errorNo: 1, message: "Faltan datos de entrada, general" })
   }
   if (!req.body.styles) {
      res.status(400).send({ errorNo: 2, message: "Faltan datos de entrada, styles" })
   }

   // Asignar los datos del cuerpo de la solicitud (req.body) a la instancia de LineChart
   lineChart.general = req.body.general;
   lineChart.styles = req.body.styles;
   //console.log(lineChart.general)
   if (!validateInput(lineChart.general.title, "string", 255)) {
      res.status(400).send({ errorNo: 1, message: "Error al mandar mensaje" });
      return;
   }
   if (lineChart.general.title)
      create_Line_Chart(lineChart).then((data) => {
         res.status(200).send({message:"done"});
      })
         .catch((err) => {
            console.log(err);
         })
})

/**
 * Ruta para obtener la configuracion de una grafica lineal por id
 */
router.get("/getOne", (req, res) => {
   const idlinechart = req.query.idlinechart;
   if (idlinechart) {
      getOneById(idlinechart)
         .then((linealchart) => {
            res.status(200).send(linealchart.rows[0]);
         })
         .catch((err) => {
            res.status(500).send(err);
         })
   } else {
      res.status(400).send("Bad request");
   }
})

/**
 * Ruta para mandar todas las linechart
 */
router.get("/getAll", (req, res) => {
   getAll()
      .then((linealchart) => {
         res.status(200).send(linealchart.rows);
      })
      .catch((err) => {
         res.status(500).send(err);
      })
})


router.post("/positions", (req, res) => {
   const x = req.body.x;
   const y = req.body.y;
   const width = req.body.width;
   const height = req.body.height;
   const id = req.body.id;

   if ((x || x == 0) && (y || y == 0) && width && height) {
      updatePositions(id, x, y, width, height)
         .then((response) => {
            res.status(200).send(response);
         })
         .catch((err) => {
            console.log("Error al guardar posicion", err);
            res.status(500).send(err);
         })
   }
})


module.exports = router;
