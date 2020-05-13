const express = require('express')
const axios = require('axios');
const readpdf = require('pdf-parse');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();


//Caminho destino para enviar os arquivos 
const destination = '\\\\192.168.188.52\\c$\\Users\\marcelo.fernandes\\Desktop\\CONSOLIDADOS'

//Destino de arquivos repetidos
const repeated = '\\\\192.168.188.52\\c$\\Users\\marcelo.fernandes\\Desktop\\REPETIDOS'

//Caminho de origem (Onde irá iniciar a procura por HISCONS)
const originPath = '\\\\192.168.188.52\\c$\\Users\\marcelo.fernandes\\Desktop\\CONSOLIDADOS'

app.listen(5000, () => {

    console.log('Example app listening on port 5000!');
  
    files = fs.readdirSync(originPath);

    for (let i = 0; i < files.length; i++) {
        
        if(files[i].includes("EXISTENTE")){
            let oldPath = originPath + path.sep + files[i];
            let newPath = repeated + path.sep + files[i];
            fs.renameSync(oldPath, newPath)
            console.log(files[i]);
        }

    }

    console.log("fim")

  
  });