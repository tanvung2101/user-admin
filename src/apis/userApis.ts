import { IListUser } from '../interface/user.interface'
import axiosClient from './axiosClient'

const userApis = {
    getListUser: (params: {size: number}): Promise<IListUser> => axiosClient.get("/api/user/user-info/", { params }),
    getTopReferrer: ():Promise<[]> => axiosClient.get("/api/user/user-info/top-user-referrer"),
}

export default userApis