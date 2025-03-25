// 📦 Zaimportuj moduły 'fs' oraz 'STATUS_CODE' do obsługi produktów.
const fs = require('fs');
const { STATUS_CODE } = require('../constants/statusCode');
// 🏗 Stwórz funkcję 'productRouting', która obsłuży żądania dotyczące produktów.
function productRouting(request, response) {
    if (request.url === "/product/add" && request.method === "GET") {
        return renderAddProductPage(response);
    }
    if (request.url === "/product/add" && request.method === "POST") {
        return addNewProduct(request, response);
    }
    if (request.url === "/product/new") {
        return renderNewProductPage(response);
    }
    console.error(`ERROR: requested url ${request.url} doesn’t exist.`);
    response.statusCode = STATUS_CODE.NOT_FOUND;
    return response.end();
}
// 🏗 Stwórz funkcję 'renderAddProductPage', która wyrenderuje stronę dodawania produktu.
function renderAddProductPage(response) {
    response.setHeader("Content-Type", "text/html");
    response.write(`
        <html>
            <head><title>Shop – Add product</title></head>
            <body>
                <h1>Add product</h1>
                <form action="/product/add" method="POST">
                    <input type="text" name="name" placeholder="Product Name" required />
                    <textarea name="description" placeholder="Product Description" required></textarea>
                    <button type="submit">Add Product</button>
                </form>
                <nav>
                    <a href="/">Home</a> |
                    <a href="/product/new">Newest product</a> |
                    <a href="/logout">Logout</a>
                </nav>
            </body>
        </html>
    `);
    return response.end();
}
// 🏗 Stwórz funkcję 'renderNewProductPage', która wyświetli najnowszy produkt z pliku 'product.txt'.
// Podpowiedź: fileSystem.readFile(...);
function renderNewProductPage(response) {
    fs.readFile("product.txt", "utf-8", (err, data) => {
        response.setHeader("Content-Type", "text/html");
        response.write(`
            <html>
                <head><title>Shop – Newest product</title></head>
                <body>
                    <h1>Newest product</h1>
                    <p>${data || "No products available"}</p>
                    <nav>
                        <a href="/">Home</a> |
                        <a href="/product/add">Add product</a> |
                        <a href="/logout">Logout</a>
                    </nav>
                </body>
            </html>
        `);
        return response.end();
    });
}
// 🏗 Stwóz funkcję 'addNewProduct', która obsłuży dodawanie nowego produktu, zapisywanie go do pliku 'product.txt' oraz przeniesie użytkownika na stronę '/product/new'.
// Podpowiedź: fileSystem.writeFile(...);
// Podpowiedź: response.setHeader("Location", "/product/new");
function addNewProduct(request, response) {
    let body = "";

    request.on("data", chunk => {
        body += chunk;
    });

    request.on("end", () => {
        const parsedData = new URLSearchParams(body);
        const product = `Name: ${parsedData.get("name")}, Description: ${parsedData.get("description")}`;

        fs.writeFile("product.txt", product, (err) => {
            response.statusCode = STATUS_CODE.FOUND;
            response.setHeader("Location", "/product/new");
            return response.end();
        });
    });
}
// 🔧 Wyeksportuj funkcję 'productRouting', aby inne moduł mogły jej używać.
module.exports = { productRouting };