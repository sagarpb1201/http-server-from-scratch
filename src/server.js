const net=require('net');

class HTTPServer{
    constructor(){
        this.routes=[];
    }

    addRoute(method, path , handler){
        const exists=this.routes.find(route=>route.method===method && route.path===path);

        if(exists){
            console.warn(`Warning: Route ${path} is already registered. Skipping duplicate.`);
            return;
        }

        this.routes.push({method,path,handler});
    }
    get(path,handler){
        this.addRoute('GET',path,handler);
    }

    post(path,handler){
        this.addRoute('POST',path,handler);
    }

    put(path,handler){
        this.addRoute('PUT',path,handler);
    }

    delete(path,handler){
        this.addRoute('DELETE',path,handler);
    }
    
    listen(port){
        const server=net.createServer((socket)=>{
            socket.on('data',(chunk)=>{
                const request=chunk.toString();

                // console.log("Recieved chunk",chunk.toString());

                const parsedRequest=request.split('\r\n');

                // console.log('parsed request',parsedRequest);

                const firstLine=parsedRequest[0].split(' ');
                const method=firstLine[0];
                const path=firstLine[1];

                // console.log('first line',firstLine);
                // console.log("Method:",method);
                // console.log("Path:",path);
                // console.log("HTTP version:",firstLine[2]);

                const route=this.routes.find(route=>{
                    return route.method===method && route.path===path
                });

                if(route){
                    const response=route.handler();
                    socket.write('HTTP/1.1 200 OK\r\n\r\n');
                    socket.write(response);
                }else{
                    socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
                    socket.write('Route not found');
                }

                socket.end();

                // socket.write('HTTP/1.1 200 OK\r\n');
                // socket.write('Content-Type: text/plain\r\n')
                // socket.write('\r\n');
                // socket.write(`You requested ${path} using ${method}`);
                // socket.end();
            });
        });

        server.listen(port,()=>{
            console.log(`Server listening on port ${port}`);
        })
    }
}

module.exports=HTTPServer;