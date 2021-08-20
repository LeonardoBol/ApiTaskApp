import {config as dotenv} from 'dotenv'; 
dotenv();

console.log(process.env.DB_DATABASE);
export const config = {
    host : process.env.DB_HOST || 'localhost',
    user : process.env.DB_USER || 'root',
    password : process.env.DB_PASSWORD || '1234',
    database : process.env.DB_DATABASE || 'tasksdb'
}