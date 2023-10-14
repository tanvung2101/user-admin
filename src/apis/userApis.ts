import { IListUser, IParamsListUser } from '../interface/user.interface'
import axiosClient from './axiosClient'

const userApis = {
  getListUser: (params: IParamsListUser): Promise<IListUser> => axiosClient.get('/api/user/user-info/', { params }),
  getTopReferrer: (): Promise<[]> => axiosClient.get('/api/user/user-info/top-user-referrer'),
  setLevelUser: (body: { id: number }): Promise<boolean> =>
    axiosClient.put('/api/user/user-info/set-level-user/level', body)
}

export default userApis
