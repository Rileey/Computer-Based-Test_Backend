import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import client from './database.js'


const app = express(); //listens to incomng connections
dotenv.config();


app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({
    limit: '50mb',
    parameterLimit: 1000000,
    extended: false
}));



app.listen(3300, ()=> {
    console.log("Server now listening on port 3300")
})

//the endpoint containing user data that is to be requested by the client. Called '/user'

app.get('/users', (req, res) => {  

    //the client queries the postgresql database -- specifically the user table/record
    client.query(`SELECT * FROM USERS`, (err, result) => {
        if (!err) {
            res.send(result.rows)
        } else  {
            console.log(err)
        }
    })
    client.end;
})

client.connect()