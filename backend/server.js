const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    exposedHeaders: ['Etag', 'Last-Modified']
  };


app.use(cors(corsOptions));


app.get('/data', (req, res) => {
    const data = {
        message: "Hola, este es la información en tu Caché :("
    };

    const etag = `"${Buffer.from(JSON.stringify(data)).toString('base64')}"`;
    console.log(`etag ${etag}`);
    
    if (req.headers['if-none-match'] === etag) {
        res.status(304).end();
    } else {
        
        res.setHeader('ETag', etag);
        res.json(data);
    }
});

const productData = {
    id: 1,
    name: "Laptop ASUS TUF Gaming F16",
    description: "Laptop para gaming y desarrollo",
    price: 1200
};

let productLastModified = new Date('2026-02-26T12:00:00Z');
    
app.get('/product', (req, res) => {
    const clientDateString = req.headers['if-modified-since'];
    if (clientDateString) {
        const clientDate = new Date(clientDateString);
        if (clientDate >= productLastModified) {
            console.log("El producto no ha cambiado. Enviando 304.");
            return res.status(304).end();
        }
    }

    console.log("Enviando datos nuevos del producto con Last-Modified");
    res.setHeader('Last-Modified', productLastModified.toUTCString());
    res.json(productData);
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
