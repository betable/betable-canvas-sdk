var http = require('http')
  , https = require('https')
  , path = require('path')
  , fs = require('fs')
  , client_id = process.env.CLIENT_ID
  , client_secret = process.env.CLIENT_SECRET
  , redirect_uri = process.env.REDIRECT_URI || 'https://localhost:8888/api/authorize'
  , crypto = require('crypto')
 
//helper function handles file verification
function getFile(filePath,res,page404){
    //does the requested file exist?
    fs.exists(filePath,function(exists){
        //if it does...
        if(exists){
            //read the fiule, run the anonymous function
            fs.readFile(filePath,function(err,contents){
                if(!err){
                    //if there was no error
                    //send the contents with the default 200/ok header
                    res.end(contents);
                } else {
                    //for our own troubleshooting
                    console.dir(err);
                };
            });
        } else {
            //if the requested file was not found
            //serve-up our custom 404 page
            fs.readFile(page404,function(err,contents){
                //if there was no error
                if(!err){
                    //send the contents with a 404/not found header 
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end(contents);
                } else {
                    //for our own troubleshooting
                    console.dir(err);
                };
            });
        };
    });
};
 
//a helper function to handle HTTP requests
function requestHandler(req, res) {
    console.log("<-"+req.url)
    var url = req.url.split('?')[0]
      , fileName = path.basename(url) || 'index.html'
      , localFolder = __dirname + '/'
      , page404 = localFolder + '404.html'
      , apiCallback = function (apiRes) {
            var body = ''
            apiRes.on('data', function (chunk) {
                console.log(chunk)
                body += chunk
            })
            apiRes.on('end', function () {
                console.log(body)
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(body)
                res.end()
            })
        }

    console.log("<-"+req.url)

    if (!url.search('/api/')) {

        var options = {
            host: 'api.betable.com'
        }

        if (url == '/api/token') {
            options.path = '/1.0/token'      
        }
        if (url == '/api/authorize') {
            options.path = '/1.0/token'      
            options.method = "POST"
            options.headers = {
                'Authorization': 'Basic '+ new Buffer(client_id+":"+client_secret).toString('base64')
              , 'Content-Type': 'application/x-www-form-urlencoded'
            }
            var apiRequest = https.request(options, function (apiRes) {
                var body = ''
                apiRes.on('data', function (chunk) {
                    console.log(chunk)
                    body += chunk
                })
                apiRes.on('end', function () {
                    console.log(body)
                    var data = JSON.parse(body)
                    console.log(data)
                    res.writeHead(302, {
                        'Location': '/?accessToken='+data.access_token
                    });
                    res.end()
                })
            })
            var code = req.url.split('?')[1].split('&')[0].split('=')[1]
            apiRequest.write('grant_type=authorization_code&redirect_uri='+redirect_uri+'&code='+code)
            apiRequest.end()
        }
        if (url == '/api/unbackedtoken') {
            options.path = '/1.0/token'      
            options.method = "POST"
            options.headers = {
                'Authorization': 'Basic '+ new Buffer(client_id+":"+client_secret).toString('base64')
              , 'Content-Type': 'application/x-www-form-urlencoded'
            }
            var randUserId = crypto.randomBytes(64).toString('hex')
            var apiRequest = https.request(options, apiCallback)
            apiRequest.write('grant_type=client_credentials&redirect_uri='+redirect_uri+'&client_user_id='+randUserId)
            apiRequest.end()
            console.log(apiRequest)
        }
    } else {
        //call our helper function
        //pass in the path to the file we want,
        //the response object, and the 404 page path
        //in case the requestd file is not found
        getFile((localFolder + fileName),res,page404);
    }
};
 
//step 2) create the server
var options = {
    key: fs.readFileSync('dummy.key'),
    cert: fs.readFileSync('dummy.crt')
}
https.createServer(options, requestHandler)
 
//step 3) listen for an HTTP request on port 3000
.listen(8888);
console.log("Server Started")
