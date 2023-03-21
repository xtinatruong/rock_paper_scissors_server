var http = require('http');
var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer();
const servers = {
  srv1: 8080,
  srv2: 5000
}

master_server = servers.srv1;

function changeServer(proxyToServerSocket) {

}



http.createServer(function(req, res){
		proxy.web(req, res, {target:'http://localhost:8080'});	
	
}).listen(9000, () => console.log(`Listening on port 9000`));



// --------- For Fault Tolerance ------------- //
    // proxyToServerSocket.setTimeout(3000);
    // proxyToServerSocket.on('timeout', () => {
    //   console.log("timeout error from: Server " + master_server.toString());
    //   changeServer(proxyToServerSocket);
    // });