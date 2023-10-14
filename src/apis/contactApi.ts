import { IListContact } from "../interface/contact.interface";
import axiosClient from "./axiosClient";

const contactApis = {
    getListContacts: (params: {size:number, page:number}):Promise<IListContact> => axiosClient.get('/api/contract/',{params}),
    updateStatusContact: (payload: {}) => axiosClient.put('/api/contract/update-contract', payload)
}

export default contactApis