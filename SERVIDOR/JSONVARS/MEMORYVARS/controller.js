const { client } = require("../conexion_databse");
const { getAllVarsGeneral } = require("../VARS/vars_controller.js");
const CalculatorExpression = require("./calculatorExpression.js");

allVars = [];
function getAllGeneralVariables() {

}
getAllGeneralVariables();


/**
 * Obtener todas las variables memory creadas 
 * 
 * */
function getAll() {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM public.memory_vars";
        client.query(query)
            .then((response) => {
                resolve(response.rows);
            })
            .catch((err) => {
                console.log("Ocurrio un error: ", err);
                reject(err);
            })
    })
}


/**
 * Obtner los datos de una variable segun el id
 * @param {number} idmemoryvar 
 * @returns 
 */
async function getMemoryVarById(idmemoryvar) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM public.memory_vars WHERE idmemoryvar = ${idmemoryvar} LIMIT 1;`;
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
 *  Funcion para calcular la variable de memoria
 *  @returns {Promise<number>}
 */
function getValueMemoryVar(idmemoryvar) {
    return new Promise((resolve, reject) => {
        getMemoryVarById(idmemoryvar)
            .then((vars) => {
                const expression = vars.rows[0].expression;
                getAllVarsGeneral()
                    .then((variables) => {
                        const newRegex = new CalculatorExpression();
                        const vars_names = variables.map((vars) => {
                            return vars.name;
                        })
                        newRegex.parserRegexVars(expression, variables, vars_names)
                            .then((value) => {
                                resolve(value);
                            })
                            .catch((err) => {
                                reject(err)
                            })
                    })
                    .catch((err) => {
                        console.log("1 Error en calculadora regex: ", err)
                        reject(err)
                    })

            })
            .catch((err) => {
                console.log("2 Error en calculadora regex: ", err)
                reject(err);
            })
    })
}


/**
 * Funcion para crear una nueva variable memory 
 * @param {string} name 
 * @param {string} expression 
 
 */
function create(name
    , expression) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO MEMORY_VARS (name, expression) VALUES ($1, $2) RETURNING *`;
        const values = [name, expression];
        client.query(query, values)
            .then((response) => {
           //     console.log("-> Variable memory insertada");
                resolve(response);
            })
            .catch((err) => {
                console.log("Ocurrio un error: ", err);
                reject(err);
            })
    })
}

module.exports = { getAll, create, getMemoryVarById, getValueMemoryVar };




