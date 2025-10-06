const net = require("net");
const Response = require("./response");
const Request = require("./request");

class HTTPServer {
  constructor() {
    this.routes = [];
    this.middleware = [];
  }

  use(handler) {
    this.middleware.push(handler);
  }

  addRoute(method, path, handler) {
    const exists = this.routes.find(
      (route) => route.method === method && route.path === path
    );

    if (exists) {
      console.warn(
        `Warning: Route ${path} is already registered. Skipping duplicate.`
      );
      return;
    }

    this.routes.push({ method, path, handler });
  }
  get(path, handler) {
    this.addRoute("GET", path, handler);
  }

  post(path, handler) {
    this.addRoute("POST", path, handler);
  }

  put(path, handler) {
    this.addRoute("PUT", path, handler);
  }

  delete(path, handler) {
    this.addRoute("DELETE", path, handler);
  }

  handleRoute(req, res) {
    const route = this.routes.find((route) => {
      return route.method === req.method && route.path === req.path;
    });

    if (route) {
      route.handler(req, res);
    } else {
      res.status(400).json({ error: "Route not found" });
    }
  }

  executeMiddleware(req,res,index=0){
      if(index>=this.middleware.length){
        this.handleRoute(req,res);
        return;
    }

    const middleware=this.middleware[index];

    const next=()=>{
        this.executeMiddleware(req,res,index+1);
    };
    try{
        middleware(req,res,next);
    }catch(error){
        console.error('Middleware error:',error);
        res.status(500).json({error:'Internal server error'});
    }
  }

  listen(port) {
    const server = net.createServer((socket) => {
      socket.on("data", (chunk) => {
        const request = chunk.toString();
        const parsedRequest = request.split("\r\n");

        const firstLine = parsedRequest[0].split(" ");
        const method = firstLine[0];
        const path = firstLine[1];

        const headers = {};
        let i = 1;
        for (; i < parsedRequest.length; i++) {
          const line = parsedRequest[i];
          if (line === "") break;
          const colonIndex = line.indexOf(":");
          if (colonIndex > 0) {
            const key = line.slice(0, colonIndex).toLowerCase();
            const value = line.slice(colonIndex + 1).trim();
            headers[key] = value;
          }
        }

        const bodyLines = parsedRequest.slice(i + 1);
        const body = bodyLines.join("\r\n");

        const req = new Request(method, path, headers, body);
        const res = new Response(socket);

        const timer=setTimeout(()=>{
            res.status(408).json({
                message:'Requset timeout'
            })
        },3000);
        res.timer=timer;

        this.executeMiddleware(req, res);
      });
    });

    server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
}

module.exports = HTTPServer;
