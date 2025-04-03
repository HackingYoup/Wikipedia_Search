const httpInstance = require('http');
const fs = require('fs')
const server = httpInstance.createServer(function(request, response){
    
    if (request.url == "/stile.css"){
        fs.readFile("stile.css", function(error, data){
            console.log(error)
            response.write(data)
            response.end()
        })
    }
    
    if (request.url == "/script.js"){
        fs.readFile("script.js", function(error, data){
            console.log(error)
            response.write(data)
            response.end()
        })
    }
    else {
        fs.readFile("index.html", function(error, data){
            console.log(error)
            response.write(data)
            response.end()
            
        })
    }
    
});
server.listen(3000, function(){
    console.log("server is listening to port 3000")
})
