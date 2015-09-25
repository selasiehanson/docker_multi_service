var express = require("express");
var morgan = require('morgan');
var amqp = require("amqplib");

// console.log(process.env);

var RB_ADDR = process.env.RMQ_PORT_5672_TCP_ADDR;
var RB_PORT = process.env.RMQ_PORT_5672_TCP_PORT;
var pass = 'guest';
var user = 'guest';

var connectionURL = 'amqp://'+ 'guest:guest@'+ RB_ADDR + ':' + RB_PORT;
var url = 'amqp://'+RB_ADDR + ':' + RB_PORT;

console.log(connectionURL);


var PORT = 8080;
var q = 'tasks';

var app = express();
//setup logger

app.use(morgan('combined'));
app.get('/', function (req, res){
  // var open = amqp.connect(url);
  testMe();
  res.json({status: "service is alive"});
});

app.post('/test', function(req, res){
  console.log('in test')
  console.log(req.body)
  // testMe();
  publishToEx();
  res.json({"status": "testing"});
});

function testMe(){
  
  var context = require('rabbit.js').createContext(url);
  context.on('ready', function() {
    console.log('connection is alive');
    var pub = context.socket('PUB'), sub = context.socket('SUB');
    sub.pipe(process.stdout);
    sub.connect('events', function() {
      pub.connect('events', function() {
        pub.write(JSON.stringify({welcome: 'rabbit.js'}), 'utf8');
      });
    });
  });

  context.on('error', function (err){
    console.log(err);
  });
}

// function puby(){

// }

function publish(){  
  var open = amqp.connect(url);
  open.then(function (conn){
    var ok = conn.createChannel();
    ok = ok.then(function(ch){
      //when rabbitmq server quits/crashes, queue will still be present
      ch.assertQueue(q, {durable: true});

      //marking message as persits a message to disk and is only removed when an acknowledgement is sent
      ch.sendToQueue(q, new Buffer('somthing to do'), {persistent: true}); 
    });

    return ok;
  }).then(null,console.warn);  
}

function publishToEx(){  
  var ex = 'logs';
  var open = amqp.connect(url);
  console.log('in publishing')
  open.then(function (conn){
    var ok = conn.createChannel();
    ok = ok.then(function(ch){
      console.log('publishing')
      
      ch.assertExchange(ex, 'fanout', {durable: true});      
      var message = {
        someData: 'hello',
        name: 'Kofi',
        age: 23
      };
      var out = JSON.stringify(message);
      console.log(out);
      ch.publish(ex,'', new Buffer(out));
    });

    return ok;
  }).then(null,console.warn);  
}

// function receiveFromExchange(){
//   var ex = 'logs';
//   open.then(function (conn){    
//     var chok = conn.createChannel();
//     chok = chok.then(function (ch){
//       var ok = ch.assertExchange(ex,'fanout' ,{durable: false});
//       ok = ok.then(function (){
//         return ch.assertQueue('',{exclusive: true});  
//       });

//       ok = ok.then(function (qok){
//         return ch.bindQueue(qok.queue, ex,'').then(function (){
//           return qok.queue;
//         });
//       });

//       ok = ok.then(function (queue){
//         return ch.consume(queue,logMessage, {noAck:true});
//       });

//       return ok.then(function(){
//         console.log(' [*] Waiting for logs. To exit Press CTRL+C');
//       });

//       function logMessage(msg){
//         console.log(" [x] '%s'", msg.content.toString());
//       }
//     });

//     return chok;
//   }).then(null, console.warn);;
// }



app.listen(PORT);
console.log('Node service running on http://localhost:' + PORT);

