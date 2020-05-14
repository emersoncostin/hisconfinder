const express = require('express')
const axios = require('axios');
const readpdf = require('pdf-parse');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const randomFile = require('random-file')

const app = express();


//Caminho destino para enviar os arquivos 
const destination = '\\\\192.168.188.52\\c$\\Users\\marcelo.fernandes\\Desktop\\CONSOLIDADOS'

//Destino de arquivos repetidos
const repeated = '\\\\192.168.188.52\\c$\\Users\\marcelo.fernandes\\Desktop\\REPETIDOS'

//Caminho de origem (Onde irá iniciar a procura por HISCONS)
const originPath = '\\\\192.168.188.52\\c$\\Users\\marcelo.fernandes\\Desktop\\CONSOLIDADOS'

app.listen(8000, () => {

    console.log('Example app listening on port 8000!');

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