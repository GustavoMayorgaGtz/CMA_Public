const { client } = require("../conexion_databse");

/**
 * Obtener todas las variables json, modbus, memoria creadas 
 * @returns {Promise<Object[]>}
 * */
function getAllVarsGeneral() {
    return new Promise((resolve, reject) => {
         const query = "SELECT * FROM public.vars";
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

module.exports = { getAllVarsGeneral };




