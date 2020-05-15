const express = require('express')
const axios = require('axios');
const readpdf = require('pdf-parse');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');


//Arquivo de variaveis de CAMINHOS...
const variables = require('./variables');

const randomFile = require('random-file')

const app = express();


//Caminho destino para enviar os arquivos 
const destination = variables.destination;

//Destino de arquivos repetidos
const repeated = variables.repeated

//Caminho de origem (Onde irá iniciar a procura por HISCONS)
const originPath = variables.originPath


app.listen(7000, () => {

    console.log('app listening on port 7000!');

    let files = fs.readdirSync(originPath);
  
/*     
    randomFile(originPath, (err, file) => {
    console.log(`The random file is: ${file}.`)
    }) */

     for (let i = 0; i < files.length; i++) {
        
        if(files[i].includes("EXISTENTE")){
            let oldPath = originPath + path.sep + files[i];
            let newPath = repeated + path.sep + files[i];
            fs.renameSync(oldPath, newPath)
            console.log(newPath)
        }
    } 

    console.log("fim")

  
  });