class Request {
  constructor(method, path, headers, body) {
    this.method = method;
    this.headers = headers;
    this.query = {};

    if (path.includes("?")) {
      const [pathName, queryParams] = path.split("?");
      this.path = pathName;

      const params = queryParams.split("&");
      params.forEach((param) => {
        const [key, value] = param.split("=");
        if (key) {
          this.query[key] = value ? decodeURIComponent(value) : "";
        }
      });
    } else {
      this.path = path;
    }
    this.body = this.bodyParser(body);
  }

  bodyParser(body) {
    if (!body || body.trim() === "") {
      return null;
    }

    const contentType = this.headers["content-type"];

    if (contentType && contentType.includes("application/json")) {
      try {
        return JSON.parse(body);
      } catch (error) {
        console.warn("Failed to parse the JSON body:", error.message);
        return body;
      }
    }
    return body;
  }
}

module.exports = Request;
