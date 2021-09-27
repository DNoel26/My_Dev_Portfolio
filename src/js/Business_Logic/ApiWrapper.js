/** @format */

class ApiWrapper {
    endpoint;
    method;
    headers = {};
    body = {};
    response;
    responseData;

    constructor(endpoint, method, headers, body) {
        this.endpoint = endpoint;
        this.method = method;
        this.headers = headers;
        this.body = body;
    }

    fetchApi() {
        return new Promise((resolve, reject) => {
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
                    this.responseData = data;
                    resolve(data);
                })
                .catch(() =>
                    console.log(
                        `Failed to fetch API @ ${this.endpoint}`,
                        reject(),
                    ),
                );
        });
    }
}

export default ApiWrapper;
