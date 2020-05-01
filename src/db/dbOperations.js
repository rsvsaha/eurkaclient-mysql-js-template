import {connection,closeConnection} from './dbConnector';
import {createQueryInsertOne,createQueryFindAll,createQueryFindByFieldValue,createQueryFindAllPaginated,
    createQueryUpdate,createQueryDelete} from './sqldialects';



export const dbOperation = (query) => {
    return new Promise((resolve,reject)=>{
        connection.query(query,(err,result)=>{
            if(err) {
                reject(err);
            }
            resolve(result);
        })
    })

}


export const insertOneOperation = (insertObj,tablename) => {
    let fieldValues = []
    let fields = []
    for(let key of Object.keys(insertObj)) {
        let fieldValue = insertObj[key];
        let field = key;
        fieldValues.push(fieldValue);
        fields.push(field);
    }
    let query = createQueryInsertOne(tablename,fields,fieldValues);
    return dbOperation(query,insertObj);
}



export const findAllOperation = (tablename) => {
    let query = createQueryFindAll(tablename);
    return dbOperation(query);
}


export const findByFieldOperation = (tablename,field,fieldValue) => {
    let query =  createQueryFindByFieldValue(tablename,field,fieldValue);
    return dbOperation(query);
}
 

export const findAllPaginatedOperation = (tablename,startingValue,pageValue) => {

    let query = createQueryFindAllPaginated(tablename,startingValue,pageValue);
    return dbOperation(query);
}

export const updateOneOperation = (tablename,updateObject,identifierfield,identifierfieldValue) => {
    let fieldValues = []
    let fields = []
    for(let key of Object.keys(updateObject)) {
        let fieldValue = updateObject[key];
        let field = key;
        fieldValues.push(fieldValue);
        fields.push(field);
    }
    let query = createQueryUpdate(tablename,fields,fieldValues,identifierfield,identifierfieldValue);
    return dbOperation(query);
}

export const deleteOneOperation = (tablename,identifierfield,identifierfieldValue) => {
    
    let query = createQueryDelete(tablename,identifierfield,identifierfieldValue);
    console.log(query);
    return dbOperation(query);
}