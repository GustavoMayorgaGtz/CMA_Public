const { getJsonVarById } = require("../JSONVARS/controller");
const axios = require("axios");
class VARS_CLASS {
    constructor() {

    }

    getValueJsonVar(id) {
        return new Promise((resolve, reject) => {
            getJsonVarById(id).then((variable) => {
                //console.log(variable.rows.length)
                if (variable.rows.length > 0) {
                //    console.log("Esta es la variable", variable.rows[0]);
                    this.doQuery(variable.rows[0])
                        .then((datos) => {
                            resolve(datos);
                        })
                        .catch((err) => {
                            reject(err)
                        })
                } else {
                    reject(false)
                }
            })
        })
    }



    /**
 * Perform the request for the incoming variable
 * @param variable 
 */
    doQuery(variable) {
        const method = variable.method;
        const url = variable.url;
        const body = variable.body;
        const fatherKeysJsonArray = variable.father_keys_json_array;

        return new Promise((resolve, reject) => {
            switch (method) {
                case 'GET':
                    axios.get(url)
                        .then((response) => {
                            let lastObject = response.data;
                            fatherKeysJsonArray.forEach((key) => {
                                if (lastObject && lastObject.hasOwnProperty(key)) {
                                    lastObject = lastObject[key];
                                }
                            });
                            resolve(lastObject);
                        })
                        .catch((err) => {
                            reject(err);
                        });


                    break;
                case 'POST':
                    axios.post(url, body)
                        .then((response) => {
                            let lastObject = response.data;
                            fatherKeysJsonArray.forEach((key) => {
                                if (lastObject && lastObject.hasOwnProperty(key)) {
                                    lastObject = lastObject[key];
                                }
                            });
                            resolve(lastObject);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                    break;
                case 'PUT':
                    axios.put(url, body)
                        .then((response) => {
                           // console.log(response.data);
                        })
                        .catch((err) => {
                            // Handle error
                        });
                    break;
                case 'OPTIONS':
                    axios.options(url, body)
                        .then((response) => {
                      //      console.log(response.data);
                        })
                        .catch((err) => {
                            // Handle error
                        });
                    break;
                case 'DELETE':
                    axios.delete(url, { data: body })
                        .then((response) => {
                          //  console.log(response.data);
                        })
                        .catch((err) => {
                            // Handle error
                        });
                    break;
                case 'PATCH':
                    axios.patch(url, body)
                        .then((response) => {
                         //  console.log(response.data);
                        })
                        .catch((err) => {
                            // Handle error
                        });
                    break;
                case 'HEAD':
                    axios.head(url, body)
                        .then((response) => {
                         //   console.log(response.data);
                        })
                        .catch((err) => {
                            // Handle error
                        });
                    break;
            }
        });
    }
    // type_GET(url) {
    //     return axios.get(url);
    //   }

    //   type_POST(url, body) {
    //     return axios.post(url, body);
    //   }

    //   type_PUT(url, body) {
    //     return axios.put(url, body);
    //   }

    //   type_OPTIONS(url, body) {
    //     return axios.options(url, body);
    //   }

    //   type_DELETE(url, body) {
    //     return axios.delete(url, { data: body });
    //   }

    //   type_PATCH(url, body) {
    //     return axios.patch(url, body);
    //   }

    //   type_HEAD(url, body) {
    //     return axios.head(url, body);
    //   }
    // }

}

module.exports = VARS_CLASS;