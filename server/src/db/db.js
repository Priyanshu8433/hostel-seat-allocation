import mysql from 'mysql2/promise'

let connection;

export const connectToDatabse = async () => {

        try {
            connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            
        });
        } 
        catch(error){
        console.log("sql connection error");
        throw error
    }
    console.log(process.env.DB_PASSWORD)
    return connection
}

