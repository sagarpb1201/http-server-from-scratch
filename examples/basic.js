const HTTPServer=require('../src/server');

const server=new HTTPServer();

server.get('/users',(req,res)=>{
    console.log('Query Params',req.query);
    res.status(200).json({
        users:['Alice','Bob','Charlie'],
        query:req.query
    });
});

server.get('/products',(req,res)=>{
    res.json({
        products:['Laptop','Phone','Tablet']
    });
});

server.post('/users',(req,res)=>{
    console.log('Recieved body:',req.body);
    console.log('Body type:',typeof req.body)

    if(req.body && typeof req.body==='object'){
        const {name,age}=req.body;
        res.status(201).json({
            message:'User created',
            body:{name,age}
        });
    }else{
        res.status(400).json({
            error:'Invalid JSON body'
        })
    }
});

server.listen(3000);