const { getJsonVarById } = require("../JSONVARS/controller");
const { doQueryJson } = require("../JSONVARS/jsonclass");
const { getOne } = require("../MODBUSVARS/controller");
const { getOneModbusVarValueLocal } = require("../MODBUSVARS/router");

class AllVar {
    idvar = 0;
    name = "";
    id = 0;
    type = "";
}
class CalculatorExpression {

    operatorsArr = [];

    /**
     * Funcion para obtener los valores de las variables incluidas en la expresion
     * @param {string} expresion 
     * @param {AllVar[]} vars 
     * @param {string[]} names 
     * @returns 
     */
    parserRegexVars(expresion, vars, names) {
        return new Promise((resolve, reject) => {
            const arraynames = expresion.split(/[{}]/);
            const variablesIncluidas = [];
            arraynames.forEach((key) => {
                const idKey = names.indexOf(key);
                if (idKey !== -1) {
                    //Se encontro la llave
                    variablesIncluidas.push(vars[idKey]);
                }
            })
            const noVariables = variablesIncluidas.length;
            let contadorVariablesObtenidas = 0;
            variablesIncluidas.forEach((variable) => {
                // ------------------------------------------------------------------
                if (variable.type == 'json') {
                    getJsonVarById(variable.id)
                        .then((variableJson) => {
                            doQueryJson(variableJson.rows[0])
                                .then((value) => {
                                    if (typeof value == 'number') {
                                        expresion = expresion.replace("{" + variable.name + "}", (value.toString().includes("-") ? ("(0" + value.toString() + ")") : value.toString()));
                                        contadorVariablesObtenidas++;
                                        if (contadorVariablesObtenidas == noVariables) {
                                            this.separarDelimitadores(expresion, resolve, reject);

                                        }
                                    } else {
                                        reject(`La variable ${variable.name}de valor no es un numero.`)
                                    }
                                })
                                .catch((err) => {
                                    console.log(err)
                                    reject("No se pudo obtener el valor de la variable " + variable.name)
                                })
                        })
                        .catch((err) => {
                            expresion = expresion.replace("{" + variable.name + "}", (value.toString().includes("-") ? ("(" + value.toString() + ")") : value.toString()));
                            reject(`No se pudo obtener la variable ${variable.name}`);
                        })
                }
                // ----------------------------------------------------------------
                if (variable.type == 'modbus') {
                    getOne(variable.id)
                        .then((variableModbus) => {
                            getOneModbusVarValueLocal(variableModbus.rows[0].idmodbusvar)
                            .then((values_vars) => {
                                const value = values_vars[0].value[0]
                                if (typeof value == "number") {
                                    expresion = expresion.replace("{" + variable.name + "}", (value.toString().includes("-") ? ("(0" + value.toString() + ")") : value.toString()));
                                    contadorVariablesObtenidas++;
                                    if (contadorVariablesObtenidas == noVariables) {
    
                                        this.separarDelimitadores(expresion, resolve, reject);
                                    }
                                } else {
                                    reject(`La variable ${variable.name}de valor no es un numero.`)
                                }
                            })
                            .catch((err) => {
                                console.log("No se pudo obtener el valor de la memoria modbus -----")
                                reject(err)
                            })
                          
                        })
                        .catch((err) => {
                            console.log(err)
                            reject("No se pudo obtener el valor de la variable " + variable.name)
                        })
                }
                // ---------------------------------------------------------------------------
            })
        })
    }



    /**
     * Funcion para separar la expresion por operadores y numeros y crear la materia prima
     * 
     */
    expresion = "";
    separarDelimitadores(expresion, resolve, reject) {
        this.expresion = expresion.replaceAll(" ", "");
        const expresionArr = this.expresion.split("");

        const delimitadores = /[()\+\-\*\/&\^]/;

        const numerosArr = this.expresion.split(delimitadores).filter((char => {
            if (char.length >= 1) {
                return char
            } else {
                return null;
            }
        }));

        const operadoresArr = [];
        const operadoresSinParentesis = [];

        expresionArr.forEach((char) => {
            if (char === "(" || char === ")" || char === "+" || char === "-" || char === "*" || char === "/" || char === "%" || char === "^") {
                operadoresArr.push(char);
            }
        })

        expresionArr.forEach((char) => {
            if (char === "+" || char === "-" || char === "*" || char === "/" || char === "%" || char === "^") {
                operadoresSinParentesis.push(char);
            }
        })

        //Verificar si hay un error
        if (operadoresSinParentesis.length == numerosArr.length - 1) {
            //Materia prima 
            this.escaneoJerarquia(operadoresArr, numerosArr, resolve)
        } else {
           // console.log(expresion)
            console.log("Hay un error en el sistema de parseo");
            reject("Error en la expresion")
        }
    }


    /**
     * Funcion que reliza las operaciones por orden de jearquia
     * @param {string[]} operadores 
     * @param {number[]} numeros 
     */
    escaneoJerarquia(operadores, numeros, resolve) {
        let cola_operadores = []; //los operadores que van a ser usados
        let parentesis_inicio = 0;
        let parentesis_fin = 0;
        let estaCerrado = false;
        let idx = 0;
        let size = operadores.length;
        let recorrer = 0;

        while (!estaCerrado) {
            const operador = operadores[idx];
            if (operador == "(") {
                cola_operadores = [];
                operadores.forEach((operador, i) => {
                    if (operador.match(/[\+\-\*\/&\^]/) && i < idx) {
                        recorrer++;
                    }
                })
                parentesis_inicio = idx;
            } else if (operador == ")") {
                estaCerrado = true;
                parentesis_fin = idx;
            } else {
                cola_operadores.push(operador);
            }
            if (idx == (size - 1)) {
                estaCerrado = true;
            }
            idx++;
        }
        let x;
        let exit = true;
        while (exit) {
            if (cola_operadores.includes("^")) {
                const index_operador = cola_operadores.indexOf("^");
                cola_operadores.splice(index_operador, 1);
                const p1 = parseFloat(numeros.splice(index_operador + recorrer, 1)[0]);
                const p2 = parseFloat(numeros.splice(index_operador + recorrer, 1)[0]);
                const resultado = p1 ** p2;
                numeros.splice(index_operador + recorrer, 0, resultado.toString());
            } else if (cola_operadores.includes("*")) {
                const index_operador = cola_operadores.indexOf("*");
                cola_operadores.splice(index_operador, 1);
                const p1 = parseFloat(numeros.splice(index_operador + recorrer, 1)[0]);
                const p2 = parseFloat(numeros.splice(index_operador + recorrer, 1)[0]);
                const resultado = p1 * p2;
                numeros.splice(index_operador + recorrer, 0, resultado.toString());
            } else if (cola_operadores.includes("/")) {
                const index_operador = cola_operadores.indexOf("/");
                cola_operadores.splice(index_operador, 1);
                const p1 = parseFloat(numeros.splice(index_operador + recorrer, 1)[0]);
                const p2 = parseFloat(numeros.splice(index_operador + recorrer, 1)[0]);
                const resultado = p1 / p2;
                numeros.splice(index_operador + recorrer, 0, resultado.toString());
            } else if (cola_operadores.includes("+")) {
                const index_operador = cola_operadores.indexOf("+");
                cola_operadores.splice(index_operador, 1);
                const p1 = parseFloat(numeros.splice(index_operador + recorrer, 1)[0]);
                const p2 = parseFloat(numeros.splice(index_operador + recorrer, 1)[0]);
                const resultado = p1 + p2;
                numeros.splice(index_operador + recorrer, 0, resultado.toString());
            } else if (cola_operadores.includes("-")) {
                const index_operador = cola_operadores.indexOf("-");
                cola_operadores.splice(index_operador, 1);
                const p1 = parseFloat(numeros.splice(index_operador + recorrer, 1)[0]);
                const p2 = parseFloat(numeros.splice(index_operador + recorrer, 1)[0]);
                const resultado = p1 - p2;
                numeros.splice(index_operador + recorrer, 0, resultado.toString());
            }
            if (cola_operadores.length == 0) {
                const elementosSize = (parentesis_fin - parentesis_inicio) + 1;
                operadores.splice(parentesis_inicio, elementosSize);
                exit = false;
                if (operadores.length > 0 && numeros.length > 1) {
                    this.escaneoJerarquia(operadores, numeros, resolve);
                } else {
                    resolve(numeros[0]);
                }
            }
        }
    }
}

module.exports = CalculatorExpression;

