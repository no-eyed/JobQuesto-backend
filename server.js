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
    //console.log(requestURL);

    const decodedParams = decodeParams(new URLSearchParams(requestURL.path));
    const { search, location, country} = decodedParams;

    // const targetURL = `${config.BASE_URL}/${country.toLowerCase()}/${config.BASE_PARAMS}&app_id=${config.API_ID}&app_key=${config.API_KEY}&results_per_page=20&what=${search}&where=${location}&content-type=application/json`;
    const targetURL = `${config.BASE_URL}/${country.toLowerCase()}/${config.BASE_PARAMS}&app_id=${config.API_ID}&app_key=${config.API_KEY}&results_per_page=20&what=${search}&where=${location}&content-type=application/json`;
    
    if(req.method === 'GET') {
        console.log(chalk.green(`Proxy GET request to : ${targetURL}`));
        axios.get(targetURL)
            .then(response => {
                res.writeHead(200, headers);
                res.end(JSON.stringify(response.data));
            })
            .catch(error => {
                console.log(chalk.red(error));
                res.writeHead(500, headers);
                res.end(JSON.stringify(error));
            });
    }
});

// const server = createServer((req,res) =>{
//     const requestURL = url.parse(req.url);

//     const decodedParams = decodeParams(new URLSearchParams(requestURL.path));
//     // console.log(decodedParams);
//     const {search,location,country = 'gb'} = decodedParams;

//     const targetUrl = `${config.BASE_URL}/in/${config.BASE_PARAMS}&app_id=${config.API_ID}&app_key=${config.API_KEY}&results_per_page=20&what=${search}&where=${location}&content-type=application/json`;

//     if(req.method === "GET"){
//         // console.log(chalk.red(`Proxy GET request to : ${targetUrl}`));
//         axios.get(targetUrl).then(response => {
//             res.writeHead(200,headers);
//             res.end(JSON.stringify(response.data));
//         })
//         .catch(err =>{
//             res.writeHead(500,headers);
//             res.end(JSON.stringify(err));
//         })
//     }

// });

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(chalk.blue(`Server listening at port ${PORT}`));
    // console.log(`Server listening at port ${PORT}`);
})