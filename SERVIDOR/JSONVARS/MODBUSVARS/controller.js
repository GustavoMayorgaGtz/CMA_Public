const { client } = require("../conexion_databse");

/**
 * Obtener todas las variables modbus creadas 
 * @returns Promise
 * */
function getAll() {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM public.modbus_vars";
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
 * Funcion para regresar los parametros modbus
 * @returns Promise<{ip,port}[]>
 */
function getConnectionsParams() {
    return new Promise((resolve, reject) => {
        const query = "SELECT ip, port FROM modbus_vars GROUP BY ip, port";
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
 * Obtener una variable modbus by id
 * @returns Promise
 * */
function getOne(idmodbusvar) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM public.modbus_vars WHERE idmodbusvar = ${idmodbusvar} LIMIT 1;`;
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
 * Controlador para insertar una variable modbus en la base de datos
 * @param {string} name 
 * @param {string} ip 
 * @param {number} port 
 * @param {number} no_register 
 * @returns Promise
 */
function create(name, ip, port, no_register) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO modbus_vars (
            name, ip, port, no_register) VALUES
            ($1, $2, $3, $4);`;
        const values = [name, ip, port, no_register];
        client.query(query, values)
            .then((response) => {
            //    console.log("-> Variable modbus insertada :");
                resolve(response);
            })
            .catch((err) => {
                console.log("Ocurrio un error al insertar modbus: ", err);
                reject(err);
            })
    })
}

module.exports = { getAll, create, getOne, getConnectionsParams };




