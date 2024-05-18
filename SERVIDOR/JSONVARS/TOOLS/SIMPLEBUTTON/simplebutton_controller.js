const { client } = require("../../conexion_databse");
const SimpleButton = require("./simplebutton");

/**
 * Funcion para crear un boton simple
 * @param {SimpleButton} simpleButtonConfiguration 
 * @returns 
 */
async function create_simpleButton(simpleButtonConfiguration) {
    const query = `INSERT INTO simple_button (title, description, idvariablejson, idvariablemodbus, background_color, text_color, style_button) 
    VALUES ('${simpleButtonConfiguration.title}','${simpleButtonConfiguration.description}',${simpleButtonConfiguration.idVariableJson ? simpleButtonConfiguration.idVariableJson : null},${simpleButtonConfiguration.idVariableModbus ? simpleButtonConfiguration.idVariableModbus : null},'${simpleButtonConfiguration.background_color}','${simpleButtonConfiguration.text_color}','${simpleButtonConfiguration.style_button}');`;
    return new Promise((resolve, reject) => {
        client.query(query)
            .then((response) => {
                resolve(response);
            })
            .catch((err) => {
                console.log("Ocurrio un error: ", err);
                reject(err);
            })
    })
}



/**
 * Funcion para obtener todos los simple button
 * @returns 
 */
async function getAll_simpleButton() {
    const query = `SELECT * FROM simple_button;`;
    return new Promise((resolve, reject) => {
        client.query(query)
            .then((response) => {
                resolve(response);
            })
            .catch((err) => {
                console.log("Ocurrio un error: ", err);
                reject(err);
            })
    })
}



/**
 * Funcion para obtener todos los simple button
 * @returns 
 */
async function getOneById_simpleButton(idSimpleButton) {
    const query = `SELECT * FROM simple_button WHERE idsimplebutton = ${idSimpleButton};`;
    return new Promise((resolve, reject) => {
        client.query(query)
            .then((response) => {
                resolve(response);
            })
            .catch((err) => {
                console.log("Ocurrio un error: ", err);
                reject(err);
            })
    })
}


async function updatePositions(idlinealchart, x, y, width, height){
    const query = `UPDATE simple_button SET x = ${x}, y = ${y}, width = ${width}, height = ${height} WHERE idsimplebutton = ${idlinealchart};`;
    return new Promise((resolve, reject) => {
        client.query(query)
            .then((response) => {
                resolve(response);
            })
            .catch((err) => {
                console.log("Ocurrio un error: ", err);
                reject(err);
            })
    }) 
}

module.exports = {
    create_simpleButton,
    getAll_simpleButton,
    getOneById_simpleButton,
    updatePositions
}

