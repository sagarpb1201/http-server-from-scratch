const HTTPServer = require("../src/server");

const server=new HTTPServer();

server.use((req,res,next)=>{
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

server.use((req,res,next)=>{
    req.timestamp=Date.now();
    next();
});

server.get('/users',(req,res)=>{
    res.json({
        users:['Alice','Bob'],
        requestTime:req.timestamp
    });
});

server.listen(3000,()=>console.log('Middleware test server running on port 3000'));