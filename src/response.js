class Response{
    constructor(socket){
        this.socket=socket;
        this.statusCode=200;
        this.headers={};
    }

    status(code){
        this.statusCode=code;
        return this;
    }

    json(data){
        this.headers['Content-Type']='application/json';

        const body=JSON.stringify(data);

        this.send(body);
    }

    send(body){
        if (this.timer) clearTimeout(this.timer);
        this.socket.write(`HTTP/1.1 ${this.statusCode} OK\r\n`);
        for(const [key,value] of Object.entries(this.headers)){
            this.socket.write(`${key}: ${value}\r\n`);
        }

        this.socket.write('\r\n');
        this.socket.write(body);
        this.socket.end();
    }
}

module.exports=Response;