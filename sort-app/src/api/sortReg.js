import { basePath, apiVersion } from "./config";

export function getSortRegApi(){
    const url = `${basePath}/${apiVersion}/sort-reg`;

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

export function postSortRegApi(data){
    const url = `${basePath}/${apiVersion}/sort-reg`;

    console.log(JSON.stringify(data));
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