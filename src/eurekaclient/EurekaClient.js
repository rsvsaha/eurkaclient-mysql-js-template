import request from 'request';
import ip from 'ip';
import {eurekaConfig} from './eurekaconfig';

var eurekaService = eurekaConfig.eurekaEndPoint;
var appName = eurekaConfig.eurekaRegistryAppName;
var port = eurekaConfig.hostPort;
var renewInterval =eurekaConfig.eurekaRenewIntervalInmillisecond;

var deregistered = false;
var registered =false;




export const EurekaClient = {
    setrenewInterval: (interval) => {
        if(interval > 0){
            renewInterval = interval; 
        }
        
    },
    setEurekaEndPoint: (serviceUrl) =>{
        eurekaService = serviceUrl;
    },
    registerWithEureka: () => {
       console.log(`Registering ${appName} with Eureka`);
       
       if(eurekaService === null || appName === null || port === null){
            throw new Error(`Please check the values of eurekaService:${eurekaService}, appname:${appName}
             and port:${port}`);
        }
        console.log(`Registering at ${eurekaService}/apps/${appName}`)
       request.post({
           headers: {'content-type': 'application/json'},
           url: `${eurekaService}/apps/${appName}`,
           body: JSON.stringify({
               instance: {
                   hostName: ip.address(),
                   instanceId: `${ip.address()}-${appName}-${port}`,
                   vipAddress: `${appName}`,
                   app: `${appName.toUpperCase()}`,
                   ipAddr: ip.address(),
                   status: `UP`,
                   port: {
                       $: port,
                       "@enabled": true
                   },
                   dataCenterInfo: {
                       "@class": `com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo`,
                       name: `MyOwn`
                   }
               }
           })
       },
       (error, response, body) => {
            if(!error) {
               console.log(`Registered with Eureka.`);
                  if(response.statusCode !== 204){
                throw new Error(`Please check the values of eurekaService Url:${eurekaService}`);
               }
               registered =true;
               setInterval(() => {
                const url = `${eurekaService}/apps/${appName}/${ip.address()}-${appName}-${port}`;   
                console.log('Sending heartbeat to'+url);
                request.put({
                       headers: {'content-type': 'application/json'},
                       url: url
                   }, (error, response, body => {
                    if(response.statusCode !== 204){
                        throw new Error(`Error in sending heartbeat:${response.statusCode}`);
                    }
                    if (error) {
                           console.log('Sending heartbeat to Eureka failed.');
                       } else {
                           console.log('Successfully sent heartbeat to Eureka.');
                       }
                   }));
               }, renewInterval * 1000);
      
           } else {
               console.log(`Not registered with eureka due to: ${error}`);
            registered =false;
        }
       });
   },
   unregisterFromEureka: (runCleanUp) => {
        console.log(`Deregistering ${appName}/${ip.address()}-${appName}-${port}`);
        request.delete({
            headers: {'content-type': 'application/json'},
            url: `${eurekaService}/apps/${appName}/${ip.address()}-${appName}-${port}`,
        },
        (error, response, body) => {
            if(!error) {
                console.log(`Deregistered from Eureka`);
                
            } else {
                console.log(`Failed to Deregister: ${error}`);
            }
            deregistered = true;
            runCleanUp();
        });  
    }

};

EurekaClient.registerWithEureka();


process.stdin.resume();//so the program will not close instantly

const endProcess = () =>{
    process.exit();
}

//do something when app is closing
process.on('exit',() =>{
    if(!deregistered && registered){
        EurekaClient.unregisterFromEureka(endProcess);
    }
    
});

//catches ctrl+c event
process.on('SIGINT', ()=>{
    if(registered) {
        EurekaClient.unregisterFromEureka(endProcess);
    }else {
        endProcess();
    }
    
});

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', () =>{
    if(registered) {
        EurekaClient.unregisterFromEureka(endProcess);
    }else {
        endProcess();
    }
});
process.on('SIGUSR2', () =>{
    if(registered) {
        EurekaClient.unregisterFromEureka(endProcess);
    }else {
        endProcess();
    }
});


//catches uncaught exceptions
process.on('uncaughtException', (exceptions) =>{
    console.log(exceptions);
    if(registered) {
        EurekaClient.unregisterFromEureka(endProcess);
    }else {
        endProcess();
    }
});