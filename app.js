const http = require('http');
const https = require('https');

// Função para fazer uma requisição à API e retornar os dados no formato JSON
function requestDataFromAPI(apiUrl, callback) {
    https.get(apiUrl, (response) => {
        let data = '';

        // Agregando os pedaços de dados recebidos
        response.on('data', (chunk) => {
            data += chunk;
        });

        // Ao finalizar a requisição, chame o callback com os dados obtidos
        response.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                callback(null, jsonData);
            } catch (error) {
                callback(error, null);
            }
        });
    }).on('error', (error) => {
        callback(error, null);
    });
}

// Criando o servidor HTTP para lidar com as solicitações do navegador
const server = http.createServer((req, res) => {
    // Verificando se a URL acessada é a raiz do servidor
    if (req.url === '/') {
        // URL da API que você deseja acessar
        const apiUrl = 'https://api.publicapis.org/entries';

        // Chamando a função para fazer a requisição à API
        requestDataFromAPI(apiUrl, (error, data) => {
            if (error) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Erro ao acessar a API');
            } else {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(data));
            }
        });
    } else {
        // Caso a URL acessada não seja a raiz do servidor, retornar um erro 404
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Página não encontrada');
    }
});

// Iniciando o servidor na porta 8080
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});