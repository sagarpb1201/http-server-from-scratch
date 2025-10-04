const HTTPServer=require('../src/server');

const server=new HTTPServer();

server.get('/users',()=>{
    return 'List of users: Alice, Bob, Charlie';
});

server.get('/users',()=>{
    return 'Listing'
})

server.get('/products',()=>{
    return 'List of products: Laptop, Phone, Tablet';
});

server.post('/users',()=>{
    return 'User created';
});

server.listen(3000);