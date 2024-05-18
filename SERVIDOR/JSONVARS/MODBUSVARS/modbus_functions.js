const { getConnections } = require("./conexiones_modbus");

class MODBUS_FUNCTIONS_CLASS {

    modbus_vars_output = [];
    size_array;

    /**
     * Funcion para buscar el valor de los dispositivos modbus
     * @param {Object[]} vars_input 
     * @returns 
     */
    getValue_Modbus_Var(vars_input) {
        this.modbus_vars_output = [];
        this.size_array = vars_input.length;
        return new Promise((resolve, reject) => {
            if (this.size_array) {
                this.recursive_Modbus_Var(0, resolve, vars_input);
            } else {
                reject(false);
            }
        })
    }

    /**
     * Funcion recursiva para obtener los valores de una conexion modbus
     * @param {number} index 
     * @param {*} resolve 
     * @param {Object[]} vars_input 
     */
    recursive_Modbus_Var(index, resolve, vars_input) {

        if (vars_input.length > 0) {
            const item_now_var_modbus = vars_input[index];
            const ip = item_now_var_modbus.ip;

            /*---------------------------------------------*/
            let isAtConnections = false;
            getConnections().forEach((connection) => {
                if (item_now_var_modbus.ip == connection.ip) {
                    isAtConnections = true;
                    this.obtenerValor(connection.modbus, resolve, item_now_var_modbus, index, vars_input);
                }
            })
            if (!isAtConnections) {
                //No existe la conexion
                const value = [-1];
                const port = item_now_var_modbus.port;
                const name = item_now_var_modbus.name;
                const no_register = item_now_var_modbus.no_register;
                const idmodbusvar = item_now_var_modbus.idmodbusvar;
                this.modbus_vars_output.push({ idmodbusvar, name, ip, port, no_register, value })
                //Pasar a la siguiente variable
                if (index >= (this.size_array - 1)) {
                    resolve(this.modbus_vars_output);
                } else {
                    this.recursive_Modbus_Var(index + 1, resolve, vars_input);
                }
            }
            /*---------------------------------------------*/
        } else {
            resolve(this.modbus_vars_output);
        }
    }


    obtenerValor(connection, resolve, variable, index, vars_input) {
        const idmodbusvar = variable.idmodbusvar;
        const name = variable.name;
        const ip = variable.ip;
        const port = variable.port;
        const no_register = variable.no_register;
        /*----------------------------------------*/
        connection.getData(no_register)
            .then((value) => {
                this.modbus_vars_output.push({ idmodbusvar, name, ip, port, no_register, value })
                if (index >= (this.size_array - 1)) {
                    resolve(this.modbus_vars_output);
                } else {
                    this.recursive_Modbus_Var(index + 1, resolve, vars_input);
                }
            })
            .catch((err) => {
                if (index >= (this.size_array - 1)) {
                    resolve(this.modbus_vars_output);
                } else {
                    this.recursive_Modbus_Var(index + 1, resolve, vars_input);
                }
            })
    }
}
module.exports = MODBUS_FUNCTIONS_CLASS