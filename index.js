const express = require('express')
const axios = require('axios');
const readpdf = require('pdf-parse');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();

//Caminho destino para enviar os arquivos 
//const destination = 'Z:\\Parana Banco\\TI\\Universe\\Milky Way\\Solar System\\TODOS'

//Caminho de origem (Onde irá iniciar a procura por HISCONS)
//const originPath = 'Z:\\Parana Banco\\TI\\Universe\\Milky Way\\Solar System\\Test'

//Caminho destino para enviar os arquivos 
const destination = '\\\\192.168.188.52\\c$\\Users\\marcelo.fernandes\\Desktop\\CONSOLIDADOS'

//Destino de arquivos repetidos
const repeated = '\\\\192.168.188.52\\c$\\Users\\marcelo.fernandes\\Desktop\\REPETIDOS'

//Caminho de origem (Onde irá iniciar a procura por HISCONS)
const originPath = '\\\\192.168.188.52\\c$\\Users\\marcelo.fernandes\\Desktop\\BACKUP VEGA\\Earth\\05052020'

    //Função que será chamada de forma recursiva
    const getAllFiles = async (dir, extn, files, result, regex) => {
        //arquivos e pastas encontradas...
        files = files || fs.readdirSync(dir);
        result = result || [];
        //regex para validar se é um PDF...
        regex = regex || new RegExp(`\\${extn}$`)
        
        for (let i = 0; i < files.length; i++) {

            
            let file =  path.join(dir, files[i]);
            //Se ele encontrar um diretório entra nesse diretório... E chama novamente a função...
            if (fs.statSync(file).isDirectory()) {
                try {
                    result = getAllFiles(file, extn, fs.readdirSync(file), result, regex);
                } catch (error) {
                    continue;
                }
            } else {

              //Essa regex é para verificar se o arquivo já não está renomeado no padrão que usamos... (Só para evitar entrar em loop infinito :P)
              let regexName = new RegExp(/^\-\ \d{4}\-\d{2}\-\d{2}\ \d{3}\.\d{3}\.\d{3}\-\d{2}\ \d{3}\.\d{3}\.\d{3}\-\d{1}\.\w{3}$/)

              console.log(path.basename(file))

            //Caso não seja um arquivo já renomeado entra nessa condição
            if(!regexName.test(path.basename(file))){

                //Uso as datas para comparar HISCONs mais recentes (Mês começa em 0)
                let data_inicio = new Date(2018,02,01);
                let data_arquivo = new Date(fs.statSync(file).mtimeMs)

                console.log(data_arquivo)
              //Se o que ele encontrar não for um diretório, então é um Arquivo... Verifico se o arquivo é um PDF através da Regex 
              //Verifico também o tamanho desse arquivo pra verificar se é um HISCON...
              //Verifico também se a data de modificação é maior que a data que estipulei
                if (regex.test(file) && fs.statSync(file).size > 280000 && fs.statSync(file).size < 400000 && data_arquivo > data_inicio) {
                    
                    //console.log(fs.statSync(file).mtime)
                    //Faz o Buffer do arquivo PDF
                    let dataBuffer = fs.readFileSync(file)
                    
                    //Data é o retorno da função que faz a leitura do PDF
                    let data = await readPdfFile(dataBuffer,file)
                   
                    //Separo linha a linha do arquivo...
                    let splitted = data.text.split(/\r\n|\r|\n/) 

                    //Regex para verificar se é um CPF válido...
                    regexCpf =  new RegExp(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/);

                    //Se tiver alguma coisa na linha 9...
                    if(splitted[9] != undefined){

                        
                        //Testo a regex na linha 9 e 10... Por algum motivo alguns arquivos contem uma linha a mais no inicio do arquivo... Isso altera a ordem das infos
                        let test1 = regexCpf.test(splitted[9])
                        let test2 = regexCpf.test(splitted[10])

                        //Se tiver CPF em alguma das 2 linhas bora...
                        if(test1 || test2){
    
                        //Separa a data do horario...
                        let myDate;
                        //cria o nome completo do arquivo...
                        let nameOfFile;

                        //Se test1 for true CPF está na linha 9
                        if(test1){
                            //Pego a data e retiro a hora...
                            myDate = splitted[4].split(" ")[0];
                            //Troco as barras por traços...
                            myDate = myDate.replace(/\//g,"-")
                            //Inverto pro padrão dos EUA, pra ficar o ano primeiro e mês por primeiro, assim fica ordenado na busca do Windows...
                            myDate =  myDate.substring(6,10) + "-" + myDate.substring(3,5) + "-" + myDate.substring(0,2)
                            //Junto tudo com um traço no começo, só pq SIM :P
                            nameOfFile = "- " + myDate + " " + splitted[9] + " " + splitted[8] + ".pdf";
                        }

                        if(test2){
                            myDate = splitted[5].split(" ")[0];
                            myDate = myDate.replace(/\//g,"-")
                            myDate =  myDate.substring(6,10) + "-" + myDate.substring(3,5) + "-" + myDate.substring(0,2)
                            nameOfFile = "- " +  myDate + " " + splitted[10] + " " + splitted[9] + ".pdf";
                        }
    
                        //O novo caminho que o arquivo irá, já com seu novo nome...
                        let newPath = destination + path.sep + nameOfFile;
                        let pathWithDate = destination + path.sep + myDate.substring(0,7) + path.sep + nameOfFile
    
                        if(newPath != ""){
                            try  {
                                //Tento enviar o arquivo pro novo destino....
                                //fs.renameSync(file, newPath) 
                                fs.renameSync(newPath, pathWithDate)

                            }catch(error){
                                //Caso retornar erro, provavelmente é por que o arquivo já existe...
                                //Então crio uma HASH aleatória pro nome do arquivo e dou esse nome pra ele, não nos interessa arquivos repetidos aqui...
                                let id = crypto.randomBytes(20).toString('hex');
                                let repeatedPath = repeated + path.sep + "EXISTENTE "+id+".pdf";
                                try{
                                    fs.renameSync(file, repeatedPath)
                                }catch(error){
                                    //Caso ele de um erro novamente eu ignoro e vou em frente... Pode ser que o arquivo esteja aberto ou outro erro desconhecido
                                    continue;
                                }
                            }

                        }
                            
                        console.log("Novo caminho:" + pathWithDate);

                        }else{
                            console.log("Erro, REGEX do CPF não está correta: " + file + "-----"+ splitted[9] + "ou" + splitted[10])
                        }
                        
                        }else{
                            console.log("Erro, CPF não encontrado..." + file)
                        }

                }

              }

            }
        }
        return result;
    }


    

//Função que fará a leitura dos arquivos PDF
async function readPdfFile(buffer, filePath){
     let info;
    await readpdf(buffer).then(function(data) {
        
        info = data;
        
            
    }).catch(function(error){
        console.log(error)
    })

    return info;

}


app.listen(8000, () => {

  console.log('Example app listening on port 8000!');

  //Inicia o script passando como parâmetro o primeiro local a procurar... E também a extensão que será procurada...
  //Irá continuar procurando de forma recursiva em todos os diretórios à seguir...
  getAllFiles(originPath, '.pdf');

});