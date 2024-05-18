const modbus = require('jsmodbus')
const net = require('net');
const { quitConnection } = require('./conexiones_modbus');
class Modbus {
    status_connection = false;
    socket = new net.Socket()
    client = new modbus.client.TCP(this.socket)
    options = {
        'host': '127.0.0.1',
        'port': '502'
    }

    constructor(host, port) {
        this.options.host = host;
        this.options.port = port;
        this.status_connection = false;
        this.socket.on("end", () => {
            quitConnection(host);
        })
        this.socket.on("error", () => {
            quitConnection(host);
        })
    }


    /**
     * Retorna el estado de la conexion
     * @returns {boolean}
     */
    getStatus() {
        return this.client.connectionState;
    }


    /**
     * Funcion para desconectar dispositivo
     */
    disconnect() {
        this.status_connection = false;
        this.socket.end();
        this.socket.removeAllListeners();
        this.socket.destroy();
    }

    /**
     * Funcion para conectar dispositivo
     * @returns
     */
    connect() {
        return new Promise((resolve, reject) => {
            let interval = setTimeout(() => {
                resolve(false);
            }, 1000)

            this.socket
                .on('connect', function () {
                    clearTimeout(interval)
                    this.status_connection = true;
                    resolve(true)
                })
                .on('error', function () {
                    this.status_connection = false;
                    resolve(false)
                })
            this.socket.connect(this.options)
        })
    }

    /**
     * Funcion para obtener datos
     * @param {*} no_register
     * @returns
     */
    getData(no_register) {
        return new Promise((resolve, reject) => {
            //Establecer timeout de un segundo
            let interval = setTimeout(()=>{
                const value = [-1];
                quitConnection(this.options.host);
                resolve(value);
            }, 1000)

            if (this.client.connectionState) { 
                this.client.readHoldingRegisters(no_register, 1)
                    .then(function (resp) {
                        clearTimeout(interval)
                        resolve(resp.response._body.valuesAsArray)
                    })
                    .catch(() => {
                        clearTimeout(interval)
                        const value = [-1];
                        quitConnection(this.options.host);
                        resolve(value);
                    })
            } else {
                clearTimeout(interval)
                const value = [-1];
                quitConnection(this.options.host);
                resolve(value);
            }
        })
    }
}

module.exports = Modbus;