const { setReloadBlobData } = require("../../../messenger");
const { client } = require("../../conexion_databse");
const LineChart = require("./linechart");

/**
 * Function
 * @param {LineChart} configuration_line
 * @returns 
 */
function create_Line_Chart(configuration_line) {
    const query = `INSERT INTO LINEAL_CHART(title, description, idVariableJson, idVariableModbus, idVariableMemory, idVariableEndpoint, sampling_number, isarray, issaveblobdata, polling_time, polling_type, fill, fill_color,
        line, line_color, line_size, line_tension, line_stepped, point_style, point_color, point_border_color, point_border_size, point_width)
        VALUES('${configuration_line.general.title}', '${configuration_line.general.description}', ${configuration_line.general.idVariableJson}, ${configuration_line.general.idVariableModbus}, ${configuration_line.general.idVariableMemory}, ${configuration_line.general.idVariableEndpoint},
        ${configuration_line.general.sampling_number}, ${configuration_line.general.isArray},${configuration_line.general.issaveblobdata}, ${configuration_line.general.polling.time}, '${configuration_line.general.polling.type}',
        ${configuration_line.styles.fill}, '${configuration_line.styles.fill_color}', ${configuration_line.styles.line}, '${configuration_line.styles.line_color}', ${configuration_line.styles.line_size}, ${configuration_line.styles.line_tension}, ${configuration_line.styles.line_stepped}, 
        '${configuration_line.styles.point_style}', '${configuration_line.styles.point_color}', '${configuration_line.styles.point_border_color}', ${configuration_line.styles.point_border_size}, ${configuration_line.styles.point_width} )`
    return new Promise((resolve, reject) => {
        client.query(query)
            .then((response) => {
                setReloadBlobData(true);
                resolve(response);
            })
            .catch((err) => {
                console.log("Ocurrio un error en insertar: ", err);
                reject(err);
            })
    })
}

/**
 * funcion para obtener una linechart by id
 * @param {number} id 
 * @returns LineChart
 */
async function getOneById(id) {
    const query = `SELECT * FROM lineal_chart WHERE idlinealchart = ${id};`;
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
 * Funcion para obtener todas las graficas lineales
 * @returns {Promise<LineChart[]>}
 */
async function getAll() {
    const query = `SELECT * FROM lineal_chart;`;
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
 * Funcion para obtener todas las graficas lineales con un espacio virtual para almacenar datos
 * @returns {Promise<LineChart[]>}
 */
async function getAllToMonitoring() {
    const query = `SELECT * FROM lineal_chart WHERE issaveblobdata = TRUE;`;
    return new Promise((resolve, reject) => {
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


async function updatePositions(idlinealchart, x, y, width, height) {
    const query = `UPDATE lineal_chart SET x = ${x}, y = ${y}, width = ${width}, height = ${height} WHERE idlinealchart = ${idlinealchart};`;
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
    create_Line_Chart,
    getOneById,
    getAll,
    getAllToMonitoring,
    updatePositions
}

