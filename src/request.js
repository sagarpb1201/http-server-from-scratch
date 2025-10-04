class Request{
    constructor(method,path,headers,body){
        this.method=method;
        this.headers=headers;
        this.body=body;
        this.query={};

        if(path.includes('?')){
            const [pathName,queryParams]=path.split('?');
            this.path=pathName;

            const params=queryParams.split('&');
            params.forEach(param=>{
                const [key,value]=param.split('=');
                if(key){
                    this.query[key]=value?decodeURIComponent(value):'';
                }
            });
        }else{
            this.path=path;
        }
    }
}

module.exports=Request;