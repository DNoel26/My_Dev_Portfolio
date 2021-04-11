class API {
    endpoint;
    method;
    headers = {};
    body = {};
    response;
    response_data;

    constructor(endpoint, method, headers, body) {
        this.endpoint = endpoint;
        this.method = method;
        this.headers = headers;
        this.body = body;
    }

    fetch_api()
    {
        return new Promise((resolve,reject)=>{
            fetch(this.endpoint, {
                method: this.method,
                headers: this.head,
                body: this.body,
            })
            .then((response) => {
                this.response = response;
                return response.json();
            })
            .then((data) => {
                this.response_data = data;
                resolve(data);
            }) 
            .catch(()=>console.log(`Failed to fetch API @ ${this.endpoint}`, reject()));   
        });    
    };
};

export default API;