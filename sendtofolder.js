const express = require('express')
const axios = require('axios');
const readpdf = require('pdf-parse');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const util = require('util');


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


app.listen(9000, () => {

    console.log('app listening on port 7000!');

    let files = fs.readdirSync(originPath);
  
/*     
    randomFile(originPath, (err, file) => {
    console.log(`The random file is: ${file}.`)
    }) */

     for (let i = 0; i < files.length; i++) {
        let bla = originPath + path.sep + files[i];
        let stat = fs.lstatSync(bla);
        if (stat.isFile()) {
            let oldPath = originPath + path.sep + files[i];
            let newPath = originPath + path.sep + files[i].substring(2,9) + path.sep + files[i];
            try  {
                fs.renameSync(oldPath, newPath)
                console.log(files[i])
            }catch(error){
                const name = util.getSystemErrorName(error.errno);
                console.error(name);  // ENOENT
            }
            
            
        }
    } 

    console.log("fim")

  
  });