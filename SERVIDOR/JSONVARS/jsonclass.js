const axios = require('axios');
const { getJsonVarById } = require('./controller');

/**
 * Este archivo esta destinado a realizar las peticiones de las variables en caso de ser necesarop
 */

class IJsonVariable {
    idjsonvar = 0;
    name = '';
    url = '';
    method = '';
    body = {}; //Esto se llama body en la base de datos //arreglo de objetos
    token_bearer = '';
    key_json = '';
    father_keys_json_array = ['']; //arreglo de string
    value;
}



/**
 * Funcion para el monitoreo de una variable json
 * @param {number} idjsonvar 
 */
function getOneJsonVarLocal(idjsonvar) {
    return new Promise((resolve, reject) => {
        getJsonVarById(idjsonvar)
            .then((variable_json) => {
            //    console.log("ESta es la variable json", variable_json)
                if (variable_json.rows.length > 0) {
                    doQueryJson(variable_json.rows[0])
                        .then((valor) => {
                          //  console.log("valor: ", valor);
                            resolve(valor);
                        })
                        .catch((err) => {
                            reject(err)
                        })
                } else {
                    reject("No hay valores json");
                }
            })
            .catch((err) => {
                console.log(err);
            })
    })
}




/**
 * Realizar la peticion de la variable entrante
 * @param {IJsonVariable} variable 
*/
function doQueryJson(variable) {
    const { method, url, body, father_keys_json_array } = variable;
    // console.log(variable);
    return new Promise((resolve, reject) => {
        switch (method) {
            case 'GET':
                axios.get(url)
                    .then(response => {
                        let lastObject = response.data;
                        father_keys_json_array.forEach(key => {
                            if (lastObject && lastObject.hasOwnProperty(key)) {
                                lastObject = lastObject[key];
                            }
                        });
                        resolve(lastObject);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case 'POST':
                axios.post(url, body)
                    .then(response => {
                        let lastObject = response.data;
                        father_keys_json_array.forEach(key => {
                            if (lastObject && lastObject.hasOwnProperty(key)) {
                                lastObject = lastObject[key];
                            }
                        });
                        resolve(lastObject);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case 'PUT':
                axios.put(url, body)
                    .then(response => {
                       // console.log(response.data);
                        resolve(response.data);
                    })
                    .catch(error => {
                        console.log("Error al realizar la petición:", error);
                        reject(error);
                    });
                break;
            case 'OPTIONS':
                axios.options(url, body)
                    .then(response => {
                     //   console.log(response.data);
                        resolve(response.data);
                    })
                    .catch(error => {
                        console.log("Error al realizar la petición:", error);
                        reject(error);
                    });
                break;
            case 'DELETE':
                axios.delete(url, body)
                    .then(response => {
                       // console.log(response.data);
                        resolve(response.data);
                    })
                    .catch(error => {
                        console.log("Error al realizar la petición:", error);
                        reject(error);
                    });
                break;
            case 'PATCH':
                axios.patch(url, body)
                    .then(response => {
                 //       console.log(response.data);
                        resolve(response.data);
                    })
                    .catch(error => {
                        console.log("Error al realizar la petición:", error);
                        reject(error);
                    });
                break;
            case 'HEAD':
                axios.head(url, body)
                    .then(response => {
                     //   console.log(response.data);
                        resolve(response.data);
                    })
                    .catch(error => {
                        console.log("Error al realizar la petición:", error);
                        reject(error);
                    });
                break;
            default:
                reject(new Error(`Método no soportado: ${method}`));
        }
    });
}

module.exports = { getOneJsonVarLocal, doQueryJson }