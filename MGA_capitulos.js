const puppeteer = require("puppeteer");
const pdf = require('pdfkit');
const fs = require('fs');


const url = 'https://www.skynovels.net/martial-god-asura/mga-capitulo-';
let inicio = 1600;
//let final = 2759;
let final = 1700;
let pdf_1 = new pdf;

pdf_1.pipe(fs.createWriteStream('MGA_CAP_1600_2759.pdf'));

(async ()=>{
    console.log("----- Iniciando Extraccion de capitulos MGA-------")
    const browser = await puppeteer.launch(
        {   headless: false
        });    
    const page = await browser.newPage();

    let capitulos = "";
    let capitulo;
    while(inicio < final){
        try{

            await page.goto(url+inicio+"/");

            capitulo = await page.evaluate(
                ()=>{
                    let salida;
                    if(document.querySelector('div#contentDiv') != null){
                       return document.querySelector('div#contentDiv').innerText.replace("Descarga: Download PDF","")
                    }
                }
    
            );

        }catch(e){
            console.log("Error pagina del capitulo no encontrada");
        }

        console.log("Capitulo: "+ inicio+" Extraido");
        //console.log(capitulo);
        //console.log("\n\n");
        inicio++;

        capitulos = capitulos + capitulo + '\n\n';
    }
    await browser.close();

    pdf_1.font('Times-Roman')
    .fontSize(14)
    .text(capitulos);
    
    pdf_1.end();

})();