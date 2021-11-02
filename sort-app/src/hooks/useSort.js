import { useState } from 'react'
import { getSortApi, postSortApi } from '../api/sort';
import { getSortRegApi, postSortRegApi } from '../api/sortReg';
import { notification } from "antd";

export const useSort = () => {

    const [sorts, setSorts] = useState(0);
    const [sortsReg, setSortsReg] = useState(0);

    const nuevoSorteo = async(data, reg) => {
        if(reg){
            const resp = await postSortRegApi(data);
            if (!resp.ok) {
                notification['error']({
                    message:resp.message
                })    
            }else{
                notification['success']({
                    message:resp.message
                })
            }
        }else{
            const resp = await postSortApi(data);
             if (!resp.ok) {
                 notification['error']({
                     message:resp.message
                 })    
             }else{
                 notification['success']({
                     message:resp.message
                 })
             }
        }
    }

    const getSort = async(reg) =>{

        if(reg){
            const resp = await getSortRegApi();
            if (!resp.ok) {
                notification['error']({
                    message:resp.message
                })   
            }else{
                setSortsReg(resp.sort.length);
            }
        }else{
            const resp = await getSortApi();
            if (!resp.ok) {
                notification['error']({
                    message:resp.message
                })   
            }else{
                setSorts(resp.sort.length);
            }
        }
    }

    return {
        nuevoSorteo,
        getSort,
        sorts,
        sortsReg
    }

}