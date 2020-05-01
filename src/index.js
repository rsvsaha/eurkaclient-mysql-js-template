import express from 'express';
import {EurekaClient} from './eurekaclient/EurekaClient';
import {insertOneOperation,findAllOperation,findByFieldOperation,findAllPaginatedOperation,updateOneOperation,
deleteOneOperation} from './db/dbOperations';


const app = express();
app.use(bodyParser.json())

const hostIpAddr= '0.0.0.0'
const hostPort = 7000;

app.get('/',(req,res)=>{
    res.send('Hello');
})

app.listen(hostPort,hostIpAddr,()=>{
    console.log(`Started at ${hostIpAddr}:${hostPort}`)
});