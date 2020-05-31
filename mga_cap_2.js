const puppeteer = require("puppeteer");
const pdf = require('pdfkit');
const fs = require('fs');

let inicio = 4080;
let final = 4196;
//let final = 1700;
let pdf_1 = new pdf;

pdf_1.pipe(fs.createWriteStream(`MGA_CAP_${inicio}_${final}.pdf`));

(async ()=>{
    console.log("----- Iniciando Extraccion de capitulos MGA-------")
    const browser = await puppeteer.launch(
        {   headless: false
        });    
        const page = await browser.newPage();
        
        let capitulos = "";
        let capitulo;
        let cambio = 3;

        while(inicio < final){
            try{
                
            let url = `http://www.devilnovels.com/2020/0${cambio}/martial-god-asura-mga-capitulo-`;
            await page.goto(url+inicio+".html");

            capitulo = await page.evaluate(
                ()=>{

                    let salida = document.querySelector(".post-body.entry-content");
                    
                    if(salida != null){
                       return salida.innerText;
                    }else{
                        return 'error';
                    }
                }
    
            );

        }catch(e){
            console.log("Error pagina del capitulo no encontrada");
        }

        //console.log(capitulo);
        //console.log("\n\n");
        if(capitulo != 'error'){
            console.log("Capitulo: "+ inicio+" Extraido");
            inicio++;
            capitulos = capitulos + capitulo + '\n\n';
        }else{
            console.log("Error al intentar descargar el capitulo");
            cambio++;
        }
    }
    await browser.close();

    pdf_1.font('Times-Roman')
    .fontSize(14)
    .text(capitulos);
    
    pdf_1.end();

})();