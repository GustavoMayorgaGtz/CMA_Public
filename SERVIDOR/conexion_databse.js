const { Client } = require('pg');

// Configuración de la conexión a PostgreSQL
const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT, // Puerto predeterminado de PostgreSQL
};

console.log(config);

// Crear un nuevo cliente de PostgreSQL
const client = new Client(config);

function connect() {
    // Conectar al servidor de PostgreSQL
    client.connect()
        .then(() => {
         //   console.log('Conexión exitosa a PostgreSQL');
        }).catch((err) => {
            console.log("Error al contectar base de datos: ", err)
        })
}
module.exports = { client, connect };
