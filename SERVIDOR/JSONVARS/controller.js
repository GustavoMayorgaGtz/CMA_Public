const { client } = require("../conexion_databse");

/**
 * Obtener todas las variables json creadas 
 * 
 * */
function getAll() {
    return new Promise((resolve, reject) => {
         const query = "SELECT * FROM public.json_endpoints_vars";
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
 * Obtner los datos de una variable segun el id
 * @param {number} idjsonvar 
 * @returns 
 */
async function getJsonVarById(idjsonvar){
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM public.json_endpoints_vars WHERE idjsonvar = ${idjsonvar} LIMIT 1;`;
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
 * Funcion para crear una nueva vaiable json 
 * @param {string} name 
 * @param {string} url 
 * @param {string} method 
 * @param {object[]} body_json 
 * @param {string} token_bearer 
 * @param {string} key_json 
 * @param {string[]} father_keys_json_array 
 */
function create(name
    , url
    , method
    , body_json
    , token_bearer
    , key_json
    , father_keys_json_array) {
    return new Promise((resolve, reject) => {
        var jsonString = JSON.stringify(body_json);

        const query = `INSERT INTO JSON_ENDPOINTS_VARS (name, url
        , method, body, token_bearer, key_json, father_keys_json_array) VALUES ($1, $2, $3, '${jsonString}'::JSONB, $4, $5, $6) RETURNING *`;
        const values = [name, url, method, token_bearer, key_json, father_keys_json_array];
        client.query(query, values)
            .then((response) => {
                resolve(response);
            })
            .catch((err) => {
                console.log("Ocurrio un error: ", err);
                reject(err);
            })
    })
}

module.exports = { getAll, create, getJsonVarById };




