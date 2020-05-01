export const createQueryInsertOne = (tablename,fields,fieldValues) => {
    if(fields instanceof Array){
        var field_dialect = fields.toString();
       
    }else{
     throw new Error('fields are not an array');   
    }
    if(fieldValues instanceof Array){ 
        var values="";
        for(var i=0;i<fieldValues.length;i++){
            console.log(typeof fieldValues[i]);
            if(typeof fieldValues[i] === 'string'){
                console.log('Here');
                values+= "'"+fieldValues[i]+"'";
            }
            else if(typeof fieldValues[i] === 'number'){
                values += fieldValues[i];
            }
            if(i !==fieldValues.length-1){
                values+=","
            }

        }
        console.log(values);
    }
    else{
        throw new Error('Values are not an array');
    }
    if(tablename === undefined) {
        throw new Error('Table name undefined ');
    }
    let query = `INSERT INTO ${tablename} (${field_dialect}) VALUES (${values});` ;
    return query;
}




export const createQueryFindAll = (tablename) => {

    if(tablename === undefined) {
        throw new Error('Table name undefined ');
    }
    let query = `SELECT * FROM ${tablename} ;` ;
    return query;
}


export const createQueryFindByFieldValue = (tablename,fieldName,fieldValue) => {

    if(typeof fieldValue === 'string'){
        fieldValue = "'"+fieldValue+"'";
    }

    if(tablename === undefined) {
        throw new Error('Table name undefined ');
    }
    let query = `SELECT * FROM ${tablename} WHERE ${fieldName} = ${fieldValue} ;` ;
    return query;
}


export const createQueryFindAllPaginated = (tablename,startingValue,numberOfRecords) =>{

    if(tablename === undefined) {
        throw new Error('Table name undefined ');
    }
    let query = `SELECT * FROM ${tablename} LIMIT ${startingValue},${numberOfRecords} ;` ;
    return query;


}


export const createQueryUpdate = (tablename,fieldNames,fieldValues,identfierField,identiferFieldValue) => {
    
    if(!fieldNames instanceof Array){
        throw new Error('fields are not an array');     
    }
    if(!fieldValues instanceof Array){ 
        throw new Error('Values are not an array');
    }
    if(tablename === undefined) {
        throw new Error('Table name undefined ');
    }

    var setValues =[];
    for(let i=0;i<fieldNames.length;i++){
        var value="";
        if(typeof fieldValues[i] === 'string'){
            value += fieldNames[i]+"="+"'"+fieldValues[i]+"'";
        }
        else{
            value += fieldNames[i]+"="+fieldValues[i];
        }
        setValues.push(value);

    }

    if(typeof identiferFieldValue ==='string'){
        identiferFieldValue="'"+identiferFieldValue+"'";
    }

    setValues = setValues.join(',');


    let query =  `UPDATE ${tablename} SET ${setValues} WHERE ${identfierField}=${identiferFieldValue} ;`;
    return query;
}

export const createQueryDelete = (tablename,identfierField,identiferFieldValue) => {
    
    
    if(tablename === undefined) {
        throw new Error('Table name undefined ');
    }


    if(typeof identiferFieldValue ==='string'){
        identiferFieldValue="'"+identiferFieldValue+"'";
    }

    let query =  `DELETE FROM ${tablename} WHERE ${identfierField}=${identiferFieldValue} ;`;
    return query;
}