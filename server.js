var server = require('ws').Server
var s = new server({ port: 5001 })
CLIENTS=[];

s.on('connection', function(ws) {
  CLIENTS.push(ws);
  console.log('New connection')

  ws.on('message', function(message) {
    console.log('Received: ', message);
    sendAll(message);
  })

  ws.on('close', () => {
    const clientIndex = CLIENTS.findIndex(it => it == ws);
    console.log('🚀 ~ ws.on ~ e:', clientIndex)
    CLIENTS.splice(clientIndex, 1);
    console.log('🚀 ~ ws.on ~ close:', CLIENTS.length)
  })

  ws.on('disconnect', () => {
    console.log('🚀 ~ ws.on ~ disconnect:', CLIENTS.length)
  })
})

function sendExceptCurrent (client, message) {
  for (var i=0; i<CLIENTS.length; i++) {
    if (CLIENTS[i] == client) { continue }

    CLIENTS[i].send(message);
  }
}

function sendAll (message) {
  console.log('send message to ', CLIENTS.length, ' client');
  for (var i=0; i<CLIENTS.length; i++) {
    try {
      CLIENTS[i].send(message);
    } catch(err) {
      console.log(err);
      CLIENTS.splice(i, 1);
    }
  }
}