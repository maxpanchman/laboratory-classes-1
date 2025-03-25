// 📦 Zaimportuj moduł odpowiedzialne za routing poszczególnych części aplikacji.
// 📦 Zaimportuj obiekt STATUS_CODE.
const { homeRouting } = require("./home");
const { productRouting } = require("./product");
const { logoutRouting } = require("./logout");
const { STATUS_CODE } = require("../constants/statusCode");
// 🏗 Stwórz tutaj funkcję 'requestRouting', która będzie obsługiwać zapytania HTTP.
// Podpowiedź: const requestRouting = (request, response) => {
// 🏗 Tutaj stwórz logowanie do konsoli informacji, mówiące o typie logowania (INFO), dacie, metodzie oraz url żądania.
// 🏗 Tutaj stwórz podstawowy 'request routing' dla ścieżek '/', zawierającej /product' oraz '/logout'. Przekaż `request` i `routing` do odpowiednio routingu.
function requestRouting(request, response) {
    console.log(`INFO [${new Date().toISOString()}]: ${request.method} – ${request.url}`);

    if (request.url === "/") {
        return homeRouting(request.method, response);
    }
    if (request.url.startsWith("/product")) {
        return productRouting(request, response);
    }
    if (request.url === "/logout") {
        return logoutRouting(request.method, response);
    }
    if (request.url === "/kill") {
        console.log(`PROCESS [${new Date().toISOString()}]: logout has been initiated and the application will be closed`);
        process.exit();
    }

    // 🏗 Obsłuż specjalny przypadek, jeśli użytkownik zostanie przekierowany na ścieżkę /kill, aplikacja się zamknie.
    // 🏗 Stwórz również logowanie do konsoli informacji, mówiące o typie logowania (PROCESS), dacie oraz informację, że wylogowowyanie zostało wywołane a aplikacja zamknie się.
    console.error(`ERROR [${new Date().toISOString()}]: requested url ${request.url} doesn’t exist.`);
    response.statusCode = STATUS_CODE.NOT_FOUND;
    response.setHeader("Content-Type", "text/html");
    response.write("<h1>404 Not Found</h1>");
    return response.end();
}
// 🏗 Tutaj stwórz obsługę przypadku, jeśli żądany URL nie istnieje. Zwróć wtedy błąd 404.
// 🏗 Stwórz również logowanie do konsoli informacji, mówiące o typie logowania (ERROR), dacie oraz informację, że żądany url nie istnieje.
//  };
module.exports = { requestRouting };
// 🔧 Wyeksportuj funkcję 'requestRouting', aby inne moduł mogły jej używać.