const { getConnectionsParams } = require("./controller");

class connectionType {
    /**
     * Declaracion de tipo
     * @param {string} ip 
     * @param {string} port 
     * @param {Modbus} modbus
     */
    constructor(ip, port, modbus) {
        this.ip = ip;
        this.port = port;
        this.modbus = modbus;
    }
}



/**
 * Funcion para crear conexiones en bases de datos
 */
function crearConexionesModbus() {
    getConnectionsParams()
        .then((parametros) => {
            //Verificar si esta activa la conexion
            connections.forEach((current_connection, idx) => {
                if (current_connection.modbus.getStatus()) {
                } else {
                    // console.log("Quitando conexion")
                    connections.splice(idx, 1);
                }
            })
            //intentando conectar conexiones faltantes
            parametros.forEach((parametro) => {
                const ip = parametro.ip;
                const port = parametro.port;
                let pushConnection = true;

                connections.forEach((current_connection) => {
                    if (current_connection.ip == parametro.ip) {
                        pushConnection = false
                    }
                })
                if (pushConnection) {
                    //Probar conexion
                    const Modbus = require("./Modbus");
                    const modbus_class = new Modbus(ip, port);
                    modbus_class.connect().then((isConnected) => {
                        if (isConnected) {
                            registerModbusConnection(ip, port, modbus_class);
                        } else {
                            // console.log("No se pudo conectar")
                        }

                    })
                }
            })
        })
        .catch((err) => {
            console.log(err);
        })
    setTimeout(() => {
        crearConexionesModbus();
    }, 3000);
}

let connections = [];



/**
 * registrar nuevo dispositivo
 * @param {string} ip 
 * @param {string} port 
 * @param {Modbus} modbus 
 */
function registerModbusConnection(ip, port, modbus) {
    const connect = new connectionType(ip, port, modbus);
    connections.push(connect);
}


/**
 * Retorna las conexiones creadas
 *  @returns {connectionType[]} clases de conexion 
 */
function getConnections() {
    return connections
}


/**
 * Funcion para quitar una conexion que se desconecto o esta en estado de error
 * @param {string} ip 
 */
function quitConnection(ip) {
    // console.log("Quitando conexion...")
    let idConnection = -1;
    getConnections().forEach((connection, idx) => {
        if (ip == connection.ip) {
            idConnection = idx;
        }
    })
    if (idConnection != -1) {
        // console.log("Conexion eliminada...")
        connections.splice(idConnection, 1);
    }
}

module.exports = {
    getConnections, registerModbusConnection, quitConnection, crearConexionesModbus
}