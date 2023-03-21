const net = require('net');

const server = net.createServer();

const servers = {
  srv1: 8080,
  srv2: 5000
}

master_server = servers.srv1;

function changeServer(proxyToServerSocket) {

}

server.on('connection', (clientToProxySocket) => {
  console.log('A Client Connected To Proxy');
  clientToProxySocket.once('data', (data) => {

    let tls = data.toString().indexOf('CONNECT') !== -1;

    let serverPort = 80; //default
    let serverAddress;
    if (tls) {
      serverPort = data.toString()
                          .split('CONNECT ')[1].split(' ')[0].split(':')[1];;
      serverAddress = data.toString()
                          .split('CONNECT ')[1].split(' ')[0].split(':')[0];
    } else {
      serverAddress = data.toString().split('Host: ')[1].split('\r\n')[0];
    }

    console.log(serverAddress);



    let proxyToServerSocket = net.createConnection({
      host: "localhost",
      port: 8080
    }, () => {
      console.log('PROXY TO SERVER SET UP');
      if (tls) {
        clientToProxySocket.write('HTTP/1.1 200 OK\r\n\n');
      } else {
        proxyToServerSocket.write(data);
      }

      clientToProxySocket.pipe(proxyToServerSocket);
      proxyToServerSocket.pipe(clientToProxySocket);

      

      proxyToServerSocket.on('error', (err) => {
        console.log('PROXY TO SERVER ERROR');
        console.log(err);
      });

      
      
    });

    // --------- For Fault Tolerance ------------- //
    // proxyToServerSocket.setTimeout(3000);
    // proxyToServerSocket.on('timeout', () => {
    //   console.log("timeout error from: Server " + master_server.toString());
    //   changeServer(proxyToServerSocket);
    // });

    clientToProxySocket.on('error', err => {
      console.log('CLIENT TO PROXY ERROR');
      console.log(err);
    });
  });
});

server.on('error', (err) => {
  console.log('SERVER ERROR');
  console.log(err);
  throw err;
});

server.on('close', () => {
  console.log('Client Disconnected');
});

server.listen(9000, () => {
  console.log('Server running at http://localhost:' + 9000);
});
