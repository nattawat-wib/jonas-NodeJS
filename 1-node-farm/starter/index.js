const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate.js");

////////////////////////////////////////
// SERVER
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8")
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8")
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8")

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8")
const dataObj = JSON.parse(data);

const slug = dataObj.map(el => slugify(el.productName, {lower: true}))
console.log(slug)

const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true)

    // overview page
    if (pathname === "/" || pathname === '/overview') {
        res.writeHead(200, { "Content-type": "text/html" });
        
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace("{%-productCard-%}", cardsHtml)

        res.end(output);

    // product page
    } else if (pathname === '/product') {
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);

        res.end(output);

    // API
    } else if (pathname === '/api') {
        res.writeHead(200, { "Content-type": "application/json" });
        res.end(data);

    // not found
    } else {
        res.writeHead(404, {
            "Content-type": "text/html",
            "my-own-header": "HAHA EIEI"
        });
        res.end("<h1> PAGE NOT FOUND!!! </h1>");
    }
});

server.listen(8000, () => {
    console.log("server is running in port 8000")
})


////////////////////////////////////////
// FILE

// Blocking
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn)

// const textOut = `this is NEWWWWWWW !!!! : ${textIn}. \nCreated on ${Date.now()}`
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written !")

// Non Blocking
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//     if(err) return console.log("ERROR !!!!!")

//     fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//         console.log(data2)
//         fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//             console.log(data3)

//             fs.writeFile("./txt/start/final.txt", `${data2}\n${data3}`, "utf-8", err => {
//                 console.log("You file have been written");
//             })
//         })
//     })
// });
// console.log("reading file...")