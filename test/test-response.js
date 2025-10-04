const net=require('net');
const Response=require('../src/response');

const server=net.createServer((socket)=>{
    const res=new Response(socket);

    res.status(201).json({
        message:'User created',
        user:{name:'Alice'}
    });
});

server.listen(4000,()=>{
    console.log("Reponse test server running on port 4000");
})