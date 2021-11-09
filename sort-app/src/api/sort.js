import { basePath, apiVersion } from "./config";

export function getSortApi(){
    const url = `${basePath}/${apiVersion}/sort`;

    const params = {
        method: "GET",
        headers:{
            "Content-Type":"application/json"
        }
    }

    return fetch(url, params)
        .then(resp =>{
            return resp.json();
        })
        .then(result =>{
            return result;
        })
        .catch(err =>{
            return err.message;
        })
}

export function postSortApi(data){
    const url = `${basePath}/${apiVersion}/sort`;

 
    const params = {
        method:"POST",
        body: JSON.stringify(data),
        headers:{
            "Content-Type": "application/json"
        }
    }

    return fetch(url, params)
    .then(resp =>{
        return resp.json();
    })
    .then(result =>{
        return result;
    })
    .catch(err =>{
        return err.message;
    })

}