const net=require('net');
const Request=require('../src/request');

const server=net.createServer((socket)=>{
    const req=new Request('GET','/users?name=alice&age=25',{},null);
    console.log('req.path',req.path);
    console.log('req.query',req.query);
});

server.listen(4001,()=>{
    console.log('Test request server running on port 4001');
})