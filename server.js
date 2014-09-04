var http = require('http')
  , https = require('https')
  , path = require('path')
  , fs = require('fs')
  , redirect_uri = process.env.REDIRECT_URI || 'https://localhost:8888/api/authorize'
  , crypto = require('crypto')
  , url = require('url')
  , manifest = require(process.cwd() + '/manifest')
  , client_id = manifest.client_id
  , client_secret = manifest.client_secret

console.log(manifest)
 
//helper function handles file verification
function getFile(localFolder, runningFolder, filePath,res,page404){
    //does the requested file exist?
    function readFile(folder) {
        //read the fiule, run the anonymous function
        fs.readFile(folder+filePath,function(err,contents){
            if(!err){
                //if there was no error
                //send the contents with the default 200/ok header
                res.end(contents);
            } else {
                //for our own troubleshooting
                console.dir(err);
            };
        });
    }
    fs.exists(runningFolder+filePath,function(exists){
        //if it does...
        if(exists){
            readFile(runningFolder)
        } else {
            fs.exists(localFolder+filePath, function (exists) {
                if(exists){
                    readFile(localFolder)
                } else {
                    if (page404) {
                        res.writeHead(404, {'Content-Type': 'text/html'});
                        getFile(localFolder, runningFolder, page404, res, null)
                    } else {
                        res.end()
                    }
                }
            });
        }
    });
};
 
//a helper function to handle HTTP requests
function requestHandler(req, res) {
    console.log("<-"+req.url)
    var requrl = req.url.split('?')[0]
      , fileName = path.basename(requrl) || 'index.html'
      , localFolder = __dirname + '/'
      , runningFolder = process.cwd() + '/'
      , page404 = localFolder + '404.html'

    if (!requrl.search('/api')) {
        var options = {
            host: 'api.betable.com'
        }
        if (requrl == '/api/authorize') {
            options.path = '/1.0/token'      
            options.method = "POST"
            options.headers = {
                'Authorization': 'Basic '+ new Buffer(client_id+":"+client_secret).toString('base64')
              , 'Content-Type': 'application/x-www-form-urlencoded'
            }
            var query = url.parse(req.url, true).query
              , code = req.url.split('?')[1].split('&')[0].split('=')[1]
              , write = null
              , params = ''
            if (query.code) {
                write = 'grant_type=authorization_code&redirect_uri='+redirect_uri+'&code='+code
            } else if (query.client_user_id) {
                write = 'grant_type=client_credentials&redirect_uri='+redirect_uri+'&client_user_id='+query.client_user_id
                params = '&demoMode=1'
            } else {
                res.writeHead(404, {'Content-Type': 'text/html'});
                getFile(localFolder, runningFolder, page404, res, null)
                res.end()
                return 
            }
            var apiRequest = https.request(options, function (apiRes) {
                var body = ''
                apiRes.on('data', function (chunk) {
                    body += chunk
                })
                apiRes.on('end', function () {
                    var data = JSON.parse(body)
                    console.log(data)
                    res.writeHead(302, {
                        'Location': '/?accessToken='+data.access_token+params
                    });
                    res.end()
                })
            })
            apiRequest.write(write)
            apiRequest.end()
        }
    } else {
        //call our helper function
        //pass in the path to the file we want,
        //the response object, and the 404 page path
        //in case the requestd file is not found
        getFile(localFolder, runningFolder, fileName, res, page404);
    }
};
 
//step 2) create the server
var options = {
    key: fs.readFileSync(__dirname + '/dummy.key'),
    cert: fs.readFileSync(__dirname + '/dummy.crt')
}
https.createServer(options, requestHandler)
 
//step 3) listen for an HTTP request on port 3000
.listen(8888);
console.log("Server Started")
