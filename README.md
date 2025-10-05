# HTTP Server From Scratch

A lightweight HTTP server framework built from the ground up using only Node.js core modules. This project demonstrates deep understanding of HTTP protocol, TCP sockets, and web framework internals.


## Why This Project?

Understanding how web frameworks work at a fundamental level. Instead of just using Express, I built the core concepts myself:
- TCP connection handling
- HTTP request/response parsing
- Routing system
- Request/Response object implementation

## Features

- HTTP/1.1 protocol implementation
- Express-like routing API
- Request object with query string parsing
- Response object with JSON support
- Status code handling
- 404 handling
- Middleware system (in progress)
- Path parameters (planned)
- Body parsing (planned)

## Installation
```
git clone https://github.com/sagarpb1201/http-server-from-scratch.git
cd http-server-from-scratch
npm install
```

## Quick Start
```
const HTTPServer = require('./src/server');

const server = new HTTPServer();

server.get('/users', (req, res) => {
    res.json({ users: ['Alice', 'Bob'] });
});

server.post('/users', (req, res) => {
    res.status(201).json({ message: 'User created' });
});

server.listen(3000);
```

## Run the example:
```
node examples/basic.js
```

## Test it:

```
curl http://localhost:3000/users
```

## API Reference

### Server Methods
```
server.get(path, handler)
```

Register a GET route.
```
javascriptserver.get('/users', (req, res) => {
    res.json({ users: [] });
});
server.post(path, handler)
```

Register a POST route.
```
javascriptserver.post('/users', (req, res) => {
    res.status(201).json({ created: true });
});
server.listen(port, callback)
```

Start the server on the specified port.

```
server.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

### Request Object
The req object represents the HTTP request:

- req.method - HTTP method (GET, POST, etc.)
- req.path - URL pathname without query string
- req.query - Parsed query parameters as object
- req.headers - Request headers as object (lowercase keys)
- req.body - Request body (string)

Example:
```
server.get('/users', (req, res) => {
    console.log(req.method);   // 'GET'
    console.log(req.path);     // '/users'
    console.log(req.query);    // { name: 'alice', age: '25' }
    console.log(req.headers);  // { host: 'localhost:3000', ... }
});
```

### Response Object

The res object provides methods to send HTTP responses:
```
res.status(code)
```

Set the HTTP status code. Returns this for chaining.
```
res.status(201).json({ created: true });
res.json(data)
```

Send a JSON response. Automatically sets Content-Type: application/json.
```
res.json({ 
    message: 'Success',
    data: { id: 1, name: 'Alice' }
});
res.send(body)
```

Send a plain text response.
```
res.send('Hello World');
```

## Examples

### Query String Handling
Request:
```
curl 'http://localhost:3000/users?name=alice&age=25'
```

Handler:
```
server.get('/users', (req, res) => {
    console.log(req.query); // { name: 'alice', age: '25' }
    res.json({ 
        message: 'User search',
        filters: req.query 
    });
});
```

JSON Responses with Status Codes
```
server.post('/users', (req, res) => {
    res.status(201).json({ 
        message: 'User created',
        data: { id: 123, name: 'Alice' }
    });
});
```

Accessing Request Headers
```
server.get('/info', (req, res) => {
    res.json({
        userAgent: req.headers['user-agent'],
        host: req.headers.host
    });
});
```

404 Handling

Automatic 404 for unmatched routes:
```
curl http://localhost:3000/nonexistent
```

Response: 
```
{"error":"Route not found"}
```

## Architecture
How It Works

This framework is built in layers, from low-level TCP to high-level routing:
1. TCP Layer:
Uses Node's net module to create a TCP server that accepts socket connections.
```
const server = net.createServer((socket) => {
    // Handle raw TCP connection
});
```
2. HTTP Parsing:
Manually parses raw HTTP request text to extract:

- Request line (method, path, HTTP version)
- Headers (key-value pairs)
- Body (content after empty line)

HTTP format:
```
GET /users?name=alice HTTP/1.1\r\n
Host: localhost:3000\r\n
User-Agent: curl/8.7.1\r\n
\r\n
```

3. Routing System
Routes are stored in an array and matched against incoming requests:
```
{
    method: 'GET',
    path: '/users',
    handler: (req, res) => { ... }
}
```
4. Request/Response Abstraction:
Custom classes provide Express-like API:

- Request class parses and exposes request data
- Response class builds and sends HTTP responses

```
File Structure
http-server-from-scratch/
├── src/
│   ├── server.js      # Main HTTPServer class, routing logic
│   ├── request.js     # Request parser (query strings, headers)
│   └── response.js    # Response builder (status, JSON)
├── examples/
│   └── basic.js       # Example usage
├── package.json
└── README.md
```

### Request Flow
1. Client connects → TCP socket created
2. Client sends HTTP request → Raw bytes received
3. Parse HTTP format → Extract method, path, headers, body
4. Create Request object → Parse query strings
5. Create Response object → Bind to socket
6. Match route → Find handler for method + path
7. Execute handler → Handler calls res.json()
8. Build HTTP response → Format status, headers, body
9. Send response → Write to socket
10. Close connection → socket.end()

## What I Learned
Building this project taught me:

- HTTP is just text over TCP - The entire protocol is human-readable text with \r\n separators
- How Express routing works - Routes are matched by storing handlers in an array and using Array.find()
- Method chaining pattern - Returning this from methods enables res.status(200).json(...)
- Request parsing complexity - Handling query strings, URL encoding, headers, and body parsing
- Socket lifecycle - Connection handling, data events, and proper cleanup
- Why frameworks exist - The amount of boilerplate needed for even basic features

## Technical Insights

- Headers are case-insensitive in HTTP, so normalize to lowercase
- Query string values need decodeURIComponent() for spaces and special characters
- The empty line (\r\n\r\n) separates headers from body
- Content-Length header tells us how many body bytes to read
- Node.js streams data in chunks, not all at once

## Roadmap
### In Progress

- Middleware system (server.use())
- Path parameters (/users/:id)

### Planned

- Automatic JSON body parsing based on Content-Type
- Static file serving
- Error handling middleware
- Cookie parsing and setting
- CORS support
- Request timeout handling
- Keep-alive connections
- Compression (gzip)
- WebSocket upgrade

## Testing
Start the example server:
```
node examples/basic.js
```

Test GET request:
```
curl http://localhost:3000/users
```

Test POST request:
```
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","age":25}'
```

Test query parameters:
```
curl 'http://localhost:3000/users?name=alice&age=25'
```

Test 404 handling:
```
curl http://localhost:3000/notfound
```

## Built With

- Node.js net module - TCP server
- Node.js http concepts - Manual HTTP implementation
- Zero external dependencies - Pure Node.js core modules

## License
MIT

## Author
Built as part of my backend engineering learning journey. Follow my progress on Twitter/X(https://x.com/sagarpb1201)