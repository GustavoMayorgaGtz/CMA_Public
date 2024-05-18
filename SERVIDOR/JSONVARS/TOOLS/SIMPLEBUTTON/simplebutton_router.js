const SimpleButton = require("./simplebutton");
const { create_simpleButton, getAll_simpleButton, getOneById_simpleButton, updatePositions } = require("./simplebutton_controller");

const router = require("express").Router();

router.post("/create", (req, res) => {
   // console.log("--Creando boton simple--")
    const simpleButton = new SimpleButton();

    //Recibir los parametros
    const title = req.body.title;
    const description = req.body.description;
    const idVariableJson = req.body.idVariableJson;
    const idVariableModbus = req.body.idVariableModbus;
    const background_color = req.body.background_color;
    const text_color = req.body.text_color;
    const style_button = req.body.style_button;

    if (!title) {
      //  console.log("titulo no definido")
        res.status(400).send({ errorNo: 1, message: "Titulo no definido" })
    }
    if (!description) {
      //  console.log("descripcion no definido")
        res.status(400).send({ errorNo: 2, message: "Descripcion no definida" })
    }
    if (!background_color) {
      //  console.log("background-color no definido")
        res.status(400).send({ errorNo: 3, message: "Background-color no definida" })
    }
    if (!text_color) {
      //  console.log("text_color no definido")
        res.status(400).send({ errorNo: 4, message: "Text_color no definida" })
    }
    if (!style_button) {
      //  console.log("style_button no definido")
        res.status(400).send({ errorNo: 5, message: "Style_button no definida" })
    }
    if (!idVariableJson && !idVariableModbus) {
      //  console.log("variable no definida")
        res.status(400).send({ errorNo: 6, message: "Variable no definida" })
    }

    simpleButton.title = title;
    simpleButton.description = description;
    simpleButton.idVariableJson = idVariableJson;
    simpleButton.idVariableModbus = idVariableModbus;
    simpleButton.background_color = background_color;
    simpleButton.text_color = text_color;
    simpleButton.style_button = style_button;

    create_simpleButton(simpleButton)
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})




router.get("/getAll", (req, res) => {
    getAll_simpleButton()
    .then((response) => {
        res.status(200).send(response.rows);
    })
    .catch((err) => {
        res.status(500).send(err);
    })
})



router.get("/getOneById", (req, res) => {
    const idSimpleButton = req.query.idSimpleButton;
    if(idSimpleButton){
        getOneById_simpleButton(idSimpleButton)
        .then((response) => {
            res.status(200).send(response.rows);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
    }else{
        res.status(400).send("Bad request");
    }    
})


router.post("/positions", (req,res) => {
    const x = req.body.x;
    const y = req.body.y;
    const width = req.body.width;
    const height = req.body.height;
    const id = req.body.id;
 
    if((x || x == 0) && (y || y == 0) && width && height){
     updatePositions(id, x, y, width, height)
     .then((response) => {
       res.status(200).send(response);
     })
     .catch((err) => {
       res.status(500).send(err);
     })
    }
 })

module.exports = router;