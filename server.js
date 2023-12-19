const createServer = require('http').createServer;
const url = require('url');
const axios = require('axios');
const chalk = require('chalk');
const config = require('./config');

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET'
};

const decodeParams = searchParams => Array.from(searchParams.keys()).reduce((acc, key) => ({ ...acc, [key]: searchParams.get(key)}), {});

const server = createServer((req, res) => {
    const requestURL = url.parse(req.url);

    const decodedParams = decodeParams(new URLSearchParams(requestURL.path));
    const { search, location, country = 'in'} = decodedParams;

    const targetURL = `${config.BASE_URL}/${country.toLowerCase()}/${config.BASE_PARAMS}&app_id=${config.API_ID}&app_key=${config.API_KEY}&results_per_page=20&what=${search}&where=${location}&content-type=application/json`;
    
    if(req.method === 'GET') {
        axios.get(targetURL)
            .then(response => {
                res.writeHead(200, headers);
                res.end(JSON.stringify(response.data));
            })
            .catch(error => {
                res.writeHead(500, headers);
                res.end(JSON.stringify(error));
            });
    }
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    //console.log(chalk.blue(`Server listening at port ${PORT}`));
    console.log(`Server listening at port ${PORT}`);
})