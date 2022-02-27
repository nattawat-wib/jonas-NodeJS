const fs = require('fs');
const http = require('http');
const url = require('url');

////////////////////////////////////////
// SERVER

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8")
const productData = JSON.parse(data);

const server = http.createServer((req, res) => {
    const pathName = req.url;

    if (pathName === "/" || pathName === '/overview') {
        res.end("this is the OVERVIEW");

    } else if (pathName === '/product') {
        res.end("this is the PRODUCT");

    } else if (pathName === '/api') {
        res.writeHead(200, { "Content-type": "application/json" });
        res.end(data);

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