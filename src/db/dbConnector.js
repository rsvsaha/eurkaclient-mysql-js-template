import mysql from 'mysql';

import {dbConfig} from './dbConfig';
export const connection = mysql.createConnection(dbConfig);

connection.connect((err)=>{
    if(err) {
        throw err;
    }
    console.log('Connected');

});

export const closeConnection = () =>{

    connection.end();
}


   
