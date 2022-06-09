import pkg from 'pg'
const { Client } = pkg;

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: 'R1leythehuman',
    connectionLimit: 10,
    database: 'cbt'
})

export default client