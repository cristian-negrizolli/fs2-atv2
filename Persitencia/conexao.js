import mysql from 'mysql2/promise';

export default async function conectar() {
    if(global.poolconnection)
    {
        return await global.poolconnection.getConnection();
    }
    else
    {
        const pool =  mysql.createPool({
            host: "localhost",
            user: "root",
            password: "",
            database: "fs2_atv1",
            connectionLimit: 50,
            idleTimeout: 30000,
            maxIdle: 30,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0
        }); 
        global.poolConexoes = pool;
        return await global.poolConexoes.getConnection();
    }
}