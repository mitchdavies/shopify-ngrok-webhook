// ngrok & Shopify Webhook Example

const PORT = 3000;
const SECRET = 'YOUR-SECRET';

var ngrok = require('ngrok');
var http = require('http'),
    crypto = require('crypto'),
    server;

function verifyShopifyHook(req) {
    var digest = crypto.createHmac('SHA256', SECRET)
            .update(new Buffer(req.body, 'utf8'))
            .digest('base64');
    
    return digest === req.headers['x-shopify-hmac-sha256'];
}

function parseRequestBody(req, res) {
    req.body = '';

    req.on('data', function(chunk) {
        req.body += chunk.toString('utf8');
    });
    req.on('end', function() {
        handleRequest(req, res);
    });
}

function handleRequest(req, res) {
    if (verifyShopifyHook(req)) {
        res.writeHead(200);
        res.end('Verified webhook');

        // Your webhook data
        console.log(req.body)

    } else {
        res.writeHead(401);
        res.end('Unverified webhook');
    }
}

server = http.createServer(parseRequestBody);

// Setup ngrok server to listen on.

server.listen(PORT, function () {
  ngrok.connect(PORT, function (err, url) {
  console.log(`Your ngrok URL is: ${url}`)
  console.log("Please put this as your url in your shopify admin")
  });
})