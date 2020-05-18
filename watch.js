const chokidar = require('chokidar');
const readdirp = require('readdirp');
const express = require('express');

const app = express();

app.listen(4000, () => {

    var count = 0;
    var dir = "\\\\192.168.188.52\\c$\\Users\\marcelo.fernandes\\Desktop\\CONSOLIDADOS"
    var regexFolder = new RegExp(/^\w{3}\-$/);

    readdirp(dir)
    .on('data', function (entry) {
        console.log(count)
        count++;
    }) 
    .on('end', function () {
        console.log("Done.  Count= " + count, "green");
    })

/*     readdirp(dir)
      .on('data', function (entry) {
        if( regexFolder.test( entry.path.substring(0,4)) ){
            let separado = entry.path.split("\\");
            if(separado[1] == "Movidos Existentes"){
                console.log(entry.path)
            count++;
            }
        }
          
      })
      .on('end', function () {
            console.log("Done.  Count= " + count, "green");
      }); */
  
  });